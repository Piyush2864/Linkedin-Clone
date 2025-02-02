import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchPosts } from '../redux/slices/postSlice';
import { fetchJobs } from '../redux/slices/jobSlice';
// import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import JobCard from '../components/JobCard';
import Sidebar from '../components/Sidebar';
import CreatePost from '../components/createPost';

const Home = () => {
  const dispatch = useAppDispatch();
  const { posts, loading: postLoading } = useAppSelector((state) => state.posts);
  const { jobs, loading: jobLoading } = useAppSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchJobs());
  }, [dispatch]);

  return (
    <div className="grid grid-cols-12 gap-4 p-4">
      {/* Sidebar */}
      <div className="col-span-3 hidden md:block">
        <Sidebar />
      </div>

      {/* Main Feed */}
      <div className="col-span-6">
        <CreatePost />  {/* Re-added CreatePost component */}
        <h2 className="text-xl font-bold mb-4">Feed</h2>
        {postLoading ? <p>Loading posts...</p> : posts.map(post => <PostCard key={post.id} post={post} />)}
      </div>

      {/* Job Updates */}
      <div className="col-span-3">
        <h2 className="text-xl font-bold mb-4">Latest Jobs</h2>
        {jobLoading ? <p>Loading jobs...</p> : jobs.map(job => <JobCard key={job.id} job={job} />)}
      </div>
    </div>
  );
};

export default Home;
