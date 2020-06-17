import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

import { Post } from './post.model';
import { Subject, throwError } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PostsService {
    errorSubject = new Subject<string>();

    constructor(private http: HttpClient) {}

    createAndStorePost(title: string, content: string) {
        const postData: Post = {title: title, content: content};
        
        // Send Http request.  for this you have to add new module to
        // app.modules called HttpClientModule and then inject HttpClient here
        // and provide its post method parameters for url and data to send.  The
        // URL is what you have see when you created project in Firebase plus a defined
        // endpoint such as /posts/add on a real environment.  For firebase, it si bit
        // different where you add your own segment after the URL (posts.json) and then
        // Firebase will replicate it as folders in Firebase database.  So, we say below
        // we want to have a node or segment called posts and for firebase, you have to 
        // add .json.
        // And since it is post, we also have to send data to post.  But this will not 
        // send anything until we subscribe to it as post() returns an Observable and 
        // Angular and rxjs will not send the request if you dont subscribe to its observable.
        // Note that you dont have to unsubscribe because it will be done for you since
        // it is an Observable provided to you by Angular for which you never need to
        // manage subscriptions and unsubscribe.
        this.http
            .post<{name: string}>(
                'https://ng-complete-guide-2ffa0.firebaseio.com/posts.json',
                postData
            )
            .subscribe(responseData => {
                console.log(responseData);
            }, error => {
                this.errorSubject.next(error.message);
            });
    }

    fetchPosts() {
        // Send Http request and same like in case of post, you have to subscribe to get
        // as well.  No subscription, no request!
        // Transforming data is something we could also do inside the subscribe() of get() 
        // or other HTTP methods and that would not be a problem, however, it is generally 
        // considered a good practice to use observable operators because it allows writing 
        // cleaner code with different steps we funnel our data through that can be easily 
        // swapped or adjusted.  That way you have lean subscribe() function and other 
        //parts focusing on other issues to solve.
        // Therefore, we can call pipe() method before calling subscribe() method (they 
        // get chained like this.http.get(....).pipe(...).subscribe(...);, because pipe() 
        // allows you to funnel your observable data through multiple operators before
        // they reach the subscribe() method.
        return this.http
            .get<{[key: string]: Post }>('https://ng-complete-guide-2ffa0.firebaseio.com/posts.json')
                // Therefore the operator I need here is the map() operator which we have to 
                // import from 'rxjs' package and map operator converts some input data into 
                // some other format output data, in this case we need to convert response 
                // data into an array.
                // The map operator takes another function (annonymous) which takes the response 
                // data and then to convert that data which is a JS object into an array, we
                // have to loop through it manually and get the key for each node returned.
                // Note below, that responseData, postArray, posts will all be of type 'any' and
                // this is because TS does not know anything about it other than that it is an 
                // object, but it does not know its type.  We can tell TS its bype by defining an
                // interface in post.model.ts file describing the object structure and then below
                // we say in map function that our response data will have a key of type string and
                // we use place holder [] below to say that and its value will be of type Post.  But
                // Angular http client get method is generic so instead of that, we can use that by
                // adding above generic portion in get() method.
                //.pipe(map((responseData: {[key: string]: Post }) => {
                .pipe(
                    map((responseData) => {
                        const postArray: Post[] = [];
                        // So we are accessing the key in array (which is the Firebase cryptic string) 
                        // and therefore we access data under it.  So, we also have to create a new JS
                        // object from it and use spread (...) operator to pull out all the key/value 
                        // pair of that nested object, so for example title: 'Test' etc, and we also
                        // add another parameter id which is the key Firebase provide to us.
                        // That key is perfect candidate for id and it is guaranteed unique as it is 
                        // generated for us by Firebase.  for that reason, I want to keep this id so 
                        // that I can uniquelly id a post for example in case I want to delete it.
                        // It is good practice to guard this though and check if 
                        // responseDAta.hasOwnProperty(key) before accessing this to make sure we are 
                        // not accesing property of some prototype. 
                        for (const key in responseData) {
                            if (responseData.hasOwnProperty(key)){
                                postArray.push({ ...responseData[key], id: key });
                            }
                        }
                        // and now we forward this postArray data converted into an array to our 
                        // subscribe method below in posts param.
                        return postArray;
                    }),
                    catchError(errorResponse => {
                        // Send to analytics or whatever you want
                        return throwError(errorResponse);
                    })
            );
    }

    deletePosts() {
        // since we are deleting all posts, we use same url as above
        return this.http.delete('https://ng-complete-guide-2ffa0.firebaseio.com/posts.json');
    }
}