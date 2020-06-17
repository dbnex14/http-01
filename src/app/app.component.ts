import { Component, OnInit, OnDestroy } from '@angular/core';

import { Post } from './post.model';
import { PostsService } from './posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts = [];
  isFetching = false;
  error = null;
  errorSubscription: Subscription;

  constructor(private postsService: PostsService) {}

  ngOnInit() {
    this.errorSubscription = this.postsService.errorSubject.subscribe(errorMessage => {
      this.error = "Error >>>> " + errorMessage;
    });
    this.fetchPosts();
  }

  ngOnDestroy(): void {
    this.errorSubscription.unsubscribe();
  }

  onCreatePost(postData: Post) {
    // code moved to service
    this.postsService.createAndStorePost(postData.title, postData.content);
  }

  onFetchPosts() {
    this.fetchPosts();
  }

  onClearPosts() {
    // Send Http request
    this.postsService.deletePosts()
      .subscribe(() => {
        this.loadedPosts = [];  //reset array
      });
  }

  private fetchPosts() {
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    }, error => {
      // do something to handle error and provide better user interface
      this.error = error.message;
      console.log(error);
    });
  }
}
