import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { socket } from "../socket/socket";

const Dash = () => {
  let [show, setShow] = useState({
    allPost: true,
    addPost: false,
    editPost: false,
  });

  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [updatedImage, setUpdatedImage] = useState();
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");

  const [allPost, setAllPost] = useState([]);
  // const [singlePostEdit, setSinglePostEdit] = useState({
  //   title: "",
  //   description: "",
  // });

  const [editPostData, setEditPostData] = useState();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const data = useSelector((e) => e.user.userInfo);
  const navigate = useNavigate();

  useEffect(() => {
    if (data === "logout") {
      navigate("/");
    }
  }, [data]);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${backendUrl}/api/v1/backend/blog/allposts`,
    };
    axios
      .request(config)
      .then((response) => {
        if ("data" in response.data) {
          setAllPost(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handlePostSubmit = () => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${backendUrl}/api/v1/backend/blog/createpost`,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: {
        title,
        description,
        post_image: image,
        authId: data.userId,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        if ("error" in response.data) {
          console.log("error", response.data.error);
          // if ("title" in response.data.error) {
          //   setError({ uname: response.data.error.uname });
          // } else if ("email" in response.data.error) {
          //   setError({ email: response.data.error.email });
          // } else if ("validEmail" in response.data.error) {
          //   setError({ email: response.data.error.validEmail });
          // } else if ("password" in response.data.error) {
          //   setError({ password: response.data.error.password });
          // } else if ("passwordLength" in response.data.error) {
          //   setError({ password: response.data.error.passwordLength });
          // } else if ("image" in response.data.error) {
          //   setError({ image: response.data.error.image });
          // }
        } else if ("success" in response.data) {
          setTitle("");
          setDescription("");
          setImage("");
          console.log("okay");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // const handlePostEdit = (postId) => {
  //   let config = {
  //     method: "get",
  //     maxBodyLength: Infinity,
  //     url: `${backendUrl}/api/v1/backend/blog/post/${postId}`,
  //   };
  //   axios
  //     .request(config)
  //     .then((response) => {
  //       if ("data" in response.data) {
  //         setSinglePostEdit(response.data.data);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  const handlePostEdit = (postId) => {
    socket.emit("postEdit", postId);
    socket.on("editPost", (post) => {
      if (post._id) {
        setEditPostData(post);
      }
    });
  };

  const handlePostUpdate = (postId) => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${backendUrl}/api/v1/backend/blog/updatepost`,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: {
        updatedTitle,
        updatedDescription,
        updated_image: updatedImage,
        postId,
        prev_image_name: editPostData?.image,
      },
    };

    axios
      .request(config)
      .then((response) => {
        if ("error" in response.data) {
          console.log("error", response.data.error);
        } else if ("success" in response.data) {
          setUpdatedImage("");
          setUpdatedTitle("");
          setUpdatedDescription("");
          setAllPost((prev) => {
            let arr = [...prev];
            let updatedPostArr = arr.map((item) => {
              if (item._id == response.data.data._id) {
                return { ...response.data.data };
              } else {
                return item;
              }
            });
            return updatedPostArr;
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = (id) => {
    socket.emit("postDelete", id);
    socket.on("deletedPost", function (deletedpost) {
      setAllPost((allposts) => {
        let arr = [...allposts];
        let updatedAllPost = arr.filter((item) => item._id != deletedpost._id);
        return updatedAllPost;
      });
    });
  };

  return (
    <div>
      {/* header */}
      <div className="absolute top-0 left-0 flex w-full h-16 pl-64 bg-white border-b">
        <div className="flex items-center flex-1 h-full px-4 text-sm font-normal tracking-wide text-gray-800">
          Dashboard
        </div>

        <div className="flex">
          <div className="flex items-center justify-center w-16 text-gray-800 border-l">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 512 512">
              <path d="m256 512c-141.164062 0-256-114.835938-256-256s114.835938-256 256-256 256 114.835938 256 256-114.835938 256-256 256zm0-480c-123.519531 0-224 100.480469-224 224s100.480469 224 224 224 224-100.480469 224-224-100.480469-224-224-224zm0 0" />
              <path d="m346.667969 181.332031h-181.335938c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h181.335938c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0" />
              <path d="m346.667969 272h-181.335938c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h181.335938c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0" />
              <path d="m346.667969 362.667969h-181.335938c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h181.335938c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0" />
            </svg>
          </div>
        </div>
      </div>
      {/* sidebar */}
      <div className="absolute top-0 left-0 w-64 h-screen overflow-y-scroll bg-white border-r">
        {/* logo */}
        <a
          href="#"
          className="flex items-center justify-center w-full h-16 text-xl font-bold text-gray-800 border-b"
        >
          <img
            src={`${backendUrl}/api/v1/images/${data.image}`}
            className="h-8"
          />
        </a>

        {/* nav */}
        <div className="pt-4 pr-4">
          <a
            href="#"
            className="flex items-center h-12 text-sm font-normal tracking-wide text-gray-700 rounded-r-lg hover:text-black"
          >
            <svg className="w-5 h-5 mx-3 fill-current" viewBox="0 0 512 512">
              <path d="m197.332031 170.667969h-160c-20.585937 0-37.332031-16.746094-37.332031-37.335938v-96c0-20.585937 16.746094-37.332031 37.332031-37.332031h160c20.589844 0 37.335938 16.746094 37.335938 37.332031v96c0 20.589844-16.746094 37.335938-37.335938 37.335938zm-160-138.667969c-2.941406 0-5.332031 2.390625-5.332031 5.332031v96c0 2.945313 2.390625 5.335938 5.332031 5.335938h160c2.945313 0 5.335938-2.390625 5.335938-5.335938v-96c0-2.941406-2.390625-5.332031-5.335938-5.332031zm0 0" />
              <path d="m197.332031 512h-160c-20.585937 0-37.332031-16.746094-37.332031-37.332031v-224c0-20.589844 16.746094-37.335938 37.332031-37.335938h160c20.589844 0 37.335938 16.746094 37.335938 37.335938v224c0 20.585937-16.746094 37.332031-37.335938 37.332031zm-160-266.667969c-2.941406 0-5.332031 2.390625-5.332031 5.335938v224c0 2.941406 2.390625 5.332031 5.332031 5.332031h160c2.945313 0 5.335938-2.390625 5.335938-5.332031v-224c0-2.945313-2.390625-5.335938-5.335938-5.335938zm0 0" />
              <path d="m474.667969 512h-160c-20.589844 0-37.335938-16.746094-37.335938-37.332031v-96c0-20.589844 16.746094-37.335938 37.335938-37.335938h160c20.585937 0 37.332031 16.746094 37.332031 37.335938v96c0 20.585937-16.746094 37.332031-37.332031 37.332031zm-160-138.667969c-2.945313 0-5.335938 2.390625-5.335938 5.335938v96c0 2.941406 2.390625 5.332031 5.335938 5.332031h160c2.941406 0 5.332031-2.390625 5.332031-5.332031v-96c0-2.945313-2.390625-5.335938-5.332031-5.335938zm0 0" />
              <path d="m474.667969 298.667969h-160c-20.589844 0-37.335938-16.746094-37.335938-37.335938v-224c0-20.585937 16.746094-37.332031 37.335938-37.332031h160c20.585937 0 37.332031 16.746094 37.332031 37.332031v224c0 20.589844-16.746094 37.335938-37.332031 37.335938zm-160-266.667969c-2.945313 0-5.335938 2.390625-5.335938 5.332031v224c0 2.945313 2.390625 5.335938 5.335938 5.335938h160c2.941406 0 5.332031-2.390625 5.332031-5.335938v-224c0-2.941406-2.390625-5.332031-5.332031-5.332031zm0 0" />
            </svg>
            Dashboard
          </a>

          <button
            onClick={() =>
              setShow({
                allPost: false,
                addPost: true,
                editPost: false,
              })
            }
            className={`flex items-center tracking-wide font-normal text-sm h-12  rounded-r-lg my-2  ${
              show.addPost || show.editPost
                ? "bg-purple-700 shadow-xl text-white w-full"
                : "text-gray-700"
            }`}
          >
            <svg className="w-5 h-5 mx-3 fill-current" viewBox="-21 0 512 512">
              <path d="m389.332031 160c-44.09375 0-80-35.882812-80-80s35.90625-80 80-80c44.097657 0 80 35.882812 80 80s-35.902343 80-80 80zm0-128c-26.453125 0-48 21.523438-48 48s21.546875 48 48 48 48-21.523438 48-48-21.546875-48-48-48zm0 0" />
              <path d="m389.332031 512c-44.09375 0-80-35.882812-80-80s35.90625-80 80-80c44.097657 0 80 35.882812 80 80s-35.902343 80-80 80zm0-128c-26.453125 0-48 21.523438-48 48s21.546875 48 48 48 48-21.523438 48-48-21.546875-48-48-48zm0 0" />
              <path d="m80 336c-44.097656 0-80-35.882812-80-80s35.902344-80 80-80 80 35.882812 80 80-35.902344 80-80 80zm0-128c-26.453125 0-48 21.523438-48 48s21.546875 48 48 48 48-21.523438 48-48-21.546875-48-48-48zm0 0" />
              <path d="m135.703125 240.425781c-5.570313 0-10.988281-2.902343-13.910156-8.0625-4.375-7.679687-1.707031-17.453125 5.972656-21.824219l197.953125-112.855468c7.65625-4.414063 17.449219-1.726563 21.800781 5.976562 4.375 7.679688 1.707031 17.449219-5.972656 21.824219l-197.953125 112.851563c-2.496094 1.40625-5.203125 2.089843-7.890625 2.089843zm0 0" />
              <path d="m333.632812 416.425781c-2.6875 0-5.398437-.683593-7.894531-2.109375l-197.953125-112.855468c-7.679687-4.371094-10.34375-14.144532-5.972656-21.824219 4.351562-7.699219 14.125-10.367188 21.804688-5.972657l197.949218 112.851563c7.679688 4.375 10.347656 14.144531 5.976563 21.824219-2.945313 5.183594-8.363281 8.085937-13.910157 8.085937zm0 0" />
            </svg>
            Add/Edit Post
          </button>

          <button
            onClick={() =>
              setShow({
                allPost: true,
                addPost: false,
                editPost: false,
              })
            }
            className={`flex items-center tracking-wide font-normal text-sm h-12  rounded-r-lg my-2  ${
              show.allPost
                ? "bg-purple-700 shadow-xl text-white  w-full"
                : "text-gray-700"
            }`}
          >
            <svg className="w-5 h-5 mx-3 fill-current" viewBox="-43 0 512 512">
              <path d="m16 512c-8.832031 0-16-7.167969-16-16v-480c0-8.832031 7.167969-16 16-16s16 7.167969 16 16v480c0 8.832031-7.167969 16-16 16zm0 0" />
              <path d="m240 277.332031h-224c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h224c2.945312 0 5.332031-2.386719 5.332031-5.332031v-202.667969c0-2.941406-2.386719-5.332031-5.332031-5.332031h-224c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h224c20.585938 0 37.332031 16.746094 37.332031 37.332031v202.667969c0 20.585938-16.746093 37.332031-37.332031 37.332031zm0 0" />
              <path d="m389.332031 362.667969h-213.332031c-20.585938 0-37.332031-16.746094-37.332031-37.335938v-64c0-8.832031 7.167969-16 16-16s16 7.167969 16 16v64c0 2.902344 2.429687 5.335938 5.332031 5.335938h213.332031c2.902344 0 5.335938-2.433594 5.335938-5.335938v-202.664062c0-2.902344-2.433594-5.335938-5.335938-5.335938h-128c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h128c20.589844 0 37.335938 16.746094 37.335938 37.335938v202.664062c0 20.589844-16.746094 37.335938-37.335938 37.335938zm0 0" />
            </svg>
            All Posts
          </button>
        </div>
      </div>
      {/* body */}
      {show.addPost && (
        <div className="w-full min-h-screen pt-16 pl-64 bg-gray-100">
          <div className="p-8 text-sm text-gray-800">
            <div className="flex justify-between">
              <h1 className="mb-8 text-4xl font-bold leading-none text-gray-700">
                You can post your blog here...
              </h1>
              <Link to="/blog">See all blog</Link>
            </div>

            <table className="w-full text-left border shadow-sm">
              <tbody>
                <tr>
                  <th className="p-3 text-xs font-bold tracking-wide text-gray-900 uppercase w-28">
                    Image
                  </th>
                  <td className="border">
                    <label
                      className="block w-full h-full p-3 pb-0 outline-none cursor-pointer "
                      htmlFor="image"
                    >
                      Upload image...
                    </label>
                    <input
                      name="post_image"
                      className="block w-full h-full p-3 pt-0 outline-none cursor-pointer "
                      type="file"
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                  </td>
                </tr>
                <tr>
                  <th className="p-3 text-xs font-bold tracking-wide text-gray-900 uppercase w-28">
                    Title
                  </th>
                  <td className="border">
                    <input
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full h-full p-3 bg-transparent outline-none"
                      value={title}
                      type="text"
                      placeholder="Blog title..."
                    />
                  </td>
                </tr>
                <tr>
                  <th className="p-3 text-xs font-bold tracking-wide text-gray-900 uppercase w-28">
                    Description
                  </th>
                  <td className="border">
                    <textarea
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full h-40 p-3 bg-transparent outline-none"
                      value={description}
                      type="text"
                      placeholder="Description..."
                    ></textarea>
                  </td>
                </tr>
                <tr>
                  <th className="p-3 text-xs font-bold tracking-wide text-gray-900 uppercase w-28">
                    Post
                  </th>
                  <td className="border ">
                    <button
                      onClick={handlePostSubmit}
                      className="w-full h-full p-3 text-white bg-green-700 outline-none"
                    >
                      Post
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {show.allPost && (
        <div className="w-full min-h-screen pt-16 pl-64 bg-gray-100">
          <div className="p-8 text-sm text-gray-800">
            <div className="flex justify-between">
              <h1 className="mb-8 text-4xl font-bold leading-none text-gray-700">
                Your blog here...
              </h1>
              <Link to="/blog">See all blog</Link>
            </div>
            <table className="w-full text-left border shadow-sm">
              <thead>
                <tr>
                  <th className="p-3 text-xs font-bold tracking-wide text-gray-900 uppercase">
                    No
                  </th>
                  <th className="p-3 text-xs font-bold tracking-wide text-gray-900 uppercase">
                    Image
                  </th>
                  <th className="p-3 text-xs font-bold tracking-wide text-gray-900 uppercase">
                    Title
                  </th>
                  <th className="p-3 text-xs font-bold tracking-wide text-gray-900 uppercase">
                    Description
                  </th>
                  <th className="p-3 text-xs font-bold tracking-wide text-gray-900 uppercase">
                    Likes
                  </th>
                  <th className="p-3 text-xs font-bold tracking-wide text-gray-900 uppercase">
                    Comments
                  </th>

                  <th className="p-3 text-xs font-bold tracking-wide text-gray-900 uppercase">
                    Edit
                  </th>
                  <th className="p-3 text-xs font-bold tracking-wide text-gray-900 uppercase">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white border rounded">
                {allPost.length != 0 &&
                  allPost.map((item, index) => (
                    <tr key={index}>
                      <td className="p-3 border" width="50px">
                        {index + 1}
                      </td>
                      <td className="p-3 border" width="90px">
                        <img
                          src={`${backendUrl}/api/v1/images/${item.image}`}
                          alt={item.title}
                          className="h-12"
                        />
                      </td>
                      <td className="p-3 border" width="180px">
                        {item.title}
                      </td>
                      <td className="p-3 border">
                        {item.description.substr(0, 100)}...
                      </td>
                      <td className="p-3 border">4</td>
                      <td className="p-3 border">2</td>
                      <td className="border " width="100px">
                        <button
                          onClick={() => {
                            setShow({
                              allPost: false,
                              addPost: false,
                              editPost: true,
                            });

                            handlePostEdit(item._id);
                          }}
                          className="w-full h-full p-3 text-white bg-gray-700 outline-none"
                        >
                          Edit
                        </button>
                      </td>
                      <td className="border " width="100px">
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="w-full h-full p-3 text-white bg-red-700 outline-none"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {show.editPost && (
        <div className="w-full min-h-screen pt-16 pl-64 bg-gray-100">
          <div className="p-8 text-sm text-gray-800">
            <div className="flex justify-between">
              <h1 className="mb-8 text-4xl font-bold leading-none text-gray-700">
                You can edit post your blog here...
              </h1>
              <Link to="/blog">See all blog</Link>
            </div>

            <table className="w-full text-left border shadow-sm">
              <tbody>
                <tr>
                  <th className="p-3 text-xs font-bold tracking-wide text-gray-900 uppercase w-28">
                    Image
                  </th>
                  <td className="border">
                    <img
                      src={`${backendUrl}/api/v1/images/${editPostData?.image}`}
                      alt={editPostData?.title}
                      className="h-12 ml-3"
                    />
                    <label
                      className="block w-full h-full p-3 pb-0 outline-none cursor-pointer "
                      htmlFor="image"
                    >
                      Upload image...
                    </label>
                    <input
                      id="image"
                      className="block w-full h-full p-3 pt-0 outline-none cursor-pointer "
                      type="file"
                      name="updated_image"
                      onChange={(e) => setUpdatedImage(e.target.files[0])}
                    />
                  </td>
                </tr>
                <tr>
                  <th className="p-3 text-xs font-bold tracking-wide text-gray-900 uppercase w-28">
                    Title
                  </th>
                  <td className="border">
                    <input
                      className="w-full h-full p-3 bg-transparent outline-none"
                      type="text"
                      onChange={(e) => setUpdatedTitle(e.target.value)}
                      value={updatedTitle ? updatedTitle : editPostData?.title}
                      placeholder="Blog title..."
                    />
                  </td>
                </tr>
                <tr>
                  <th className="p-3 text-xs font-bold tracking-wide text-gray-900 uppercase w-28">
                    Description
                  </th>
                  <td className="border">
                    <textarea
                      className="w-full h-40 p-3 bg-transparent outline-none"
                      type="text"
                      onChange={(e) => setUpdatedDescription(e.target.value)}
                      value={
                        updatedDescription
                          ? updatedDescription
                          : editPostData?.description
                      }
                      placeholder="Description..."
                    ></textarea>
                  </td>
                </tr>
                <tr>
                  <th className="p-3 text-xs font-bold tracking-wide text-gray-900 uppercase w-28">
                    Post
                  </th>
                  <td className="border ">
                    <button
                      onClick={() => {
                        setShow({
                          allPost: true,
                          addPost: false,
                          editPost: false,
                        });
                        handlePostUpdate(editPostData?._id);
                      }}
                      className="w-full h-full p-3 text-white bg-green-700 outline-none"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dash;
