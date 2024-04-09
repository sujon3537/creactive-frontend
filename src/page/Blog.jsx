import { useEffect, useState } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../socket/socket";
import axios from "axios";

const Blog = () => {
  let [like, setLike] = useState(false);
  let [comment, setComment] = useState("");
  let [commentArr, setCommentArr] = useState([]);
  let [singlePost, setSinglePost] = useState();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  let data = useSelector((e) => e.user.userInfo);
  let navigate = useNavigate();
  let { postid } = useParams();

  useEffect(() => {
    if (data === "logout") {
      navigate("/");
    }
  }, [data]);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${backendUrl}/api/v1/frontend/blog/${postid}`,
    };
    axios
      .request(config)
      .then((response) => {
        if ("data" in response.data) {
          setSinglePost(response.data.data);
          setCommentArr(response.data.data.commentId);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleLike = (postId) => {
    socket.emit("postLike", {
      postId,
      authId: data.userId,
    });

    socket.on("postLikeToogle", (updatedData) => {
      if (updatedData) {
        setSinglePost(updatedData);
        if (updatedData.like.includes(data.userId)) {
          setLike(true);
        } else {
          setLike(false);
        }
      }
    });
  };

  const handleComment = () => {
    console.log(data.userId);
    socket.emit("addComment", {
      comment,
      authId: data.userId,
      postId: singlePost._id,
    });

    socket.on("getComment", (data) => {
      console.log(data);
      if (data) {
        setComment("");
        setCommentArr(data);
      }
    });
  };

  return (
    <div>
      <div>
        <div>
          <section className="bg-white ">
            <div className="max-w-screen-xl px-4 py-8 mx-auto lg:py-16 lg:px-6">
              <div className="max-w-screen-sm mx-auto mb-8 text-center lg:mb-16">
                <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 lg:text-4xl ">
                  Latest Blog
                </h2>
                <p className="font-light text-gray-500 sm:text-xl">
                  We use an agile approach to test assumptions and connect with
                  the needs of your audience early and often.
                </p>
              </div>
              <div className="grid gap-8 ">
                <article className="p-6 bg-white border border-gray-200 rounded-lg shadow-md ">
                  <div className="flex items-center justify-between mb-5 text-gray-500">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
                      </svg>
                      Tutorial
                    </span>
                    <span className="text-sm cursor-pointer">
                      View all comment
                    </span>
                  </div>

                  <div className="p-4 my-4 border">
                    <img
                      className="h-[600px] w-full object-cover"
                      src={`${backendUrl}/api/v1/images/${singlePost?.image}`}
                      alt={singlePost?.title}
                    />
                  </div>

                  <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
                    <a href="#">{singlePost?.title}</a>
                  </h2>
                  <p className="mb-5 font-light text-gray-500 ">
                    {singlePost?.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-x-2 text-2xl">
                      <span>{singlePost?.like.length}</span>
                      {like ? (
                        <AiFillLike
                          className="text-2xl cursor-pointer"
                          onClick={() => {
                            setLike(!like);
                            handleLike(singlePost._id);
                          }}
                        />
                      ) : (
                        <AiOutlineLike
                          className="text-2xl cursor-pointer"
                          onClick={() => {
                            setLike(!like);
                            handleLike(singlePost._id);
                          }}
                        />
                      )}
                    </div>
                    <div>
                      <form>
                        <label htmlFor="chat" className="sr-only">
                          Your comment
                        </label>
                        <div className="flex items-center ">
                          <textarea
                            id="chat"
                            rows="1"
                            className="block mx-4 p-2.5 w-[350px] text-sm text-gray-900 outline-none bg-white rounded-lg border border-gray-300    "
                            placeholder="Your comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={handleComment}
                            className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 "
                          >
                            <svg
                              className="w-5 h-5 rotate-90 rtl:-rotate-90"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 18 20"
                            >
                              <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                            </svg>
                            <span className="sr-only">Send message</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </article>

                <div className="px-6 border border-slate-300 py-7 rounded-xl">
                  {commentArr.length != 0 &&
                    commentArr.map((item, index) => (
                      <article key={index}>
                        <div className="flex items-center mb-4">
                          <img
                            className="w-10 h-10 rounded-full me-4"
                            src={`${backendUrl}/api/v1/images/${item.authId?.image}`}
                            alt={item.authId.uname}
                          />
                          <div className="font-medium ">
                            <p>
                              {item.authId.uname}
                              <time className="block text-sm text-gray-500 dark:text-gray-400">
                                Active
                              </time>
                            </p>
                          </div>
                        </div>

                        <p className="mb-2 text-gray-500 ">
                          {item.description}
                        </p>
                      </article>
                    ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Blog;
