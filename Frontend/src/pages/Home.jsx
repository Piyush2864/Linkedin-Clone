import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchPosts } from '../redux/slices/postSlice';
import { fetchJobs, fetchRecommendedJobs } from '../redux/slices/jobSlice';
import PostCard from '../components/PostCard';
import JobCard from '../components/JobCard';
import Sidebar from '../components/Sidebar';
import CreatePost from '../components/CreatePost';

const Home = () => {
  const dispatch = useAppDispatch();
  const { posts, loading: postLoading } = useAppSelector((state) => state.posts);
  const { jobs, recommendedJobs, loading: jobLoading } = useAppSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchJobs());
    dispatch(fetchRecommendedJobs()); // Fetch recommended jobs
  }, [dispatch]);

  return (
    <div className="grid grid-cols-12 gap-4 p-4">
      {/* Sidebar */}
      <div className="col-span-3 hidden md:block">
        <Sidebar />
      </div>

      {/* Main Feed */}
      <div className="col-span-6">
        <CreatePost />  
        <h2 className="text-xl font-bold mb-4">Feed</h2>
        {postLoading ? <p>Loading posts...</p> : posts.map(post => <PostCard key={post.id} post={post} />)}
      </div>

      {/* Job Updates & Recommendations */}
      <div className="col-span-3">
        <h2 className="text-xl font-bold mb-4">Latest Jobs</h2>
        {jobLoading ? <p>Loading jobs...</p> : jobs.map(job => <JobCard key={job.id} job={job} />)}

        <h2 className="text-xl font-bold mt-6 mb-4">Recommended Jobs</h2>
        {jobLoading ? <p>Loading recommendations...</p> : recommendedJobs.map(job => <JobCard key={job.id} job={job} />)}
      </div>
    </div>
  );
};

export default Home;
