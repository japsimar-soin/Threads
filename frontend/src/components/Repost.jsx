import Post from "./Post";

const Repost = ({ post, repostedBy }) => {
    // Your logic to display repost
    return (
        <div>
            <p>Reposted by {repostedBy}</p>
            <Post post={post} postedBy={post.postedBy} />
        </div>
    );
};

export default Repost;