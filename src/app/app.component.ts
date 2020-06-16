import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchPosts();
  }

  onCreatePost(postData: { title: string; content: string }) {
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
      .post(
        'https://ng-complete-guide-2ffa0.firebaseio.com/posts.json',
        postData
      )
      .subscribe(responseData => {
        console.log(responseData);
      });
  }

  onFetchPosts() {
    this.fetchPosts();
  }

  onClearPosts() {
    // Send Http request
  }

  private fetchPosts() {
    // Send Http request and same like in case of post, you have to subscribe to get
    // as well.  No subscription, no request!
    this.http
      .get('https://ng-complete-guide-2ffa0.firebaseio.com/posts.json')
        .subscribe(posts => {
          console.log(posts);
        });
  }
}
