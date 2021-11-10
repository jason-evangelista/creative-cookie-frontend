/*eslint-disable react-hooks/rules-of-hooks*/
/*eslint-disable react-hooks/exhaustive-deps*/

import React, { Fragment } from "react";
import {
  DropdownButton,
  Dropdown,
  Badge,
  Button,
  Spinner,
} from "react-bootstrap";
import { GlobalDataContext } from "../../context/GlobalData";
import { formatDistanceToNow } from "date-fns";
import { useFetch } from "../../api/useFetch";
import EditPostModal from "../../component/global/EditPostModal";
import DeletePostModal from "../../component/global/DeletePostModal";
import ShowPostModal from "../../component/post/ShowPostModal";
import SpinnerLoad from "../../component/global/SpinnerLoad";
import ToolTip from "../../component/global/ToolTip";
const DashboardPost = () => {
  const {
    post,
    postLike,
    postComment,
    userInfo,
    setShowPostDetail,
    showPostDetail,
    setPostOneItem,
    setEditPostDetail,
    postReloader,
    setPostReloader,
    setPostLimit,
    postLimit,
    loadMorePostRef,
    btnLoadMoreRef,
    setGlobalMessage,
    useNotify,
    likeSpinnerLoadRef,
  } = React.useContext(GlobalDataContext);
  const removeArrowDropdownRef = React.useRef(null);
  const showPostModalRef = React.useRef(null);
  const editPostModalRef = React.useRef(null);
  const deletePostModalRef = React.useRef(null);
  React.useEffect(() => {
    if (removeArrowDropdownRef.current) {
      removeArrowDropdownRef.current.firstChild.classList.remove(
        "dropdown-toggle"
      );
      removeArrowDropdownRef.current.firstChild.classList.add("post-menu-btn");
      const menuBtn = document.querySelectorAll(".dropdown-toggle");
      menuBtn.forEach((item, i) => {
        item.classList.remove("dropdown-toggle");
        item.classList.add("post-menu-btn");
      });
    }
  }, [post, postReloader]);

  // @TODO: show post modal
  const openShowPostModal = (postItem) => {
    setPostOneItem(postItem);
    const filterLikes = postLike.filter(
      (postLikeItem) => postLikeItem.plr_post_ref === postItem.post_id
    );
    const filterComment = postComment.filter(
      (postCommentItem) => postCommentItem.comment_post_ref === postItem.post_id
    );
    setShowPostDetail({
      post: postItem,
      post_like: filterLikes,
      post_comment: filterComment,
    });
    showPostModalRef.current.toggleModal();
  };

  // @TODO: open edit post modal
  const openEditPostModal = (_post_id, _post_content, _post_tag) => {
    setEditPostDetail({
      post_id: _post_id,
      post_content: _post_content,
      post_tag: JSON.parse(_post_tag),
    });
    editPostModalRef.current.toggleModal();
  };

  // @TODO: open delete post modal
  const openDeletePostModal = (post_id) => {
    deletePostModalRef.current.toggleModal(post_id);
  };

  // @TODO: like post request
  const likePostRequest = (item, index) => {
    likeSpinnerLoadRef.current[index].classList.remove("d-none");
    console.log(likeSpinnerLoadRef);
    const params = {
      post_id: item.post_id,
      plr_status: true,
    };
    useFetch(params, "POST", "post-like", setGlobalMessage, useNotify)
      .then((res) => {
        if (res) {
          if (res.success) {
            setGlobalMessage(res.message);
            setPostReloader(!postReloader);
            likeSpinnerLoadRef.current[index].classList.add("d-none");
          } else {
            useNotify(res.message, "error");
            likeSpinnerLoadRef.current[index].classList.add("d-none");
          }
        } else {
          throw new Error("Something went wrong. Please try again or later");
        }
      })
      .catch((err) => {
        setGlobalMessage(err.message);
        useNotify(err.message, "error");
        likeSpinnerLoadRef.current[index].classList.add("d-none");
      });
  };

  // @TODO: Count likes
  const countLikes = (postItem) => {
    const filterCountLike = postLike.filter(
      (postLikeItem) => postLikeItem.plr_post_ref === postItem.post_id
    );
    return filterCountLike;
  };

  const commentCount = (postItem) => {
    const filterCommentCount = postComment.filter(
      (postCommentItem) => postCommentItem.comment_post_ref === postItem.post_id
    );
    return filterCommentCount;
  };
  // @TODO: check like status
  const checkLikeStatus = (item) => {
    if (
      postLike.find(
        (postItem) =>
          postItem.plr_post_ref === item.post_id &&
          postItem.plr_user_ref === userInfo.user_id
      )
    ) {
      return "text-primary";
    } else {
      return "";
    }
  };
  // @TODO: iterate post;
  const dashboardPostList = () => {
    return post.map((item, index) => (
      <div className="post-card-wrapper border" key={item.post_id}>
        <div className="post-header border-bottom py-1">
          <div className="post-created-by-wrapper me-1">
            <h6
              className="m-0 post-created-by"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              <span className="fw-bold">
                <i className="bi bi-check-circle-fill text-primary"></i>&nbsp;
                {item.user_full_name}&nbsp;
              </span>
            </h6>
          </div>
          <div className="post-menu-btn-wrapper ms-1">
            <DropdownButton
              ref={removeArrowDropdownRef}
              drop="start"
              size="sm"
              menuVariant="dark"
              title={
                <span>
                  <i className="bi bi-three-dots-vertical"></i>
                </span>
              }
            >
              {userInfo.user_id === item.post_created_by ? (
                <Fragment>
                  <Dropdown.Header>
                    <span>
                      <i className="bi bi-gear"></i>
                    </span>
                    &nbsp;Post Options
                  </Dropdown.Header>
                  <Dropdown.Item
                    onClick={() =>
                      openEditPostModal(
                        item.post_id,
                        item.post_content,
                        item.post_tag
                      )
                    }
                  >
                    <span>
                      <i className="bi bi-pencil-square"></i>&nbsp;Edit
                    </span>
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => openDeletePostModal(item.post_id)}
                  >
                    <span>
                      <i className="bi bi-trash-fill"></i>&nbsp;Delete
                    </span>
                  </Dropdown.Item>
                </Fragment>
              ) : (
                <Dropdown.Item>
                  <span>
                    <i className="bi bi-exclamation-circle-fill"></i>
                    &nbsp;Report
                  </span>
                </Dropdown.Item>
              )}
            </DropdownButton>
          </div>
        </div>
        <div className="post-date my-2">
          <span style={{ fontSize: ".8rem" }}>
            <i className="bi bi-clock"></i>&nbsp;
            {formatDistanceToNow(new Date(item.post_created_at), {
              addSuffix: true,
            })}
            &nbsp;
            {new Date(item.post_created_at) < new Date(item.post_updated_at) ? (
              <span>
                <i className="bi bi-dot"></i>
                Edited
              </span>
            ) : (
              ""
            )}
          </span>
        </div>
        <div className="post-tag-wrapper d-flex align-items-center flex-wrap">
          {JSON.parse(item.post_tag).map((tag_item) => (
            <Badge className="mx-1 my-1" size="sm" bg="dark" key={tag_item.seq}>
              {tag_item.tag_text}
            </Badge>
          ))}
        </div>
        <div className="post-body-wrapper">
          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: item.post_content }}
          ></div>
        </div>
        <div className="post-content-fade-wrapper"></div>
        <div className="post-footer border-top">
          <div className="w-100 d-flex justify-content-center">
            <ToolTip placement="top" text="Like">
              <button
                className="w-100 std-btn-style std-black p-1 post-footer-btn"
                onClick={() => likePostRequest(item, index)}
              >
                <span
                  className={checkLikeStatus(item)}
                  style={{ fontSize: "1.1rem" }}
                >
                  <i className="bi bi-hand-thumbs-up-fill"></i>
                  &nbsp;
                  <span className="fw-bold">
                    {countLikes(item).length > 0 ? countLikes(item).length : ""}
                  </span>
                  &nbsp;
                  <span className="like-spinner d-none">
                    <Spinner animation="grow" size="sm" />
                  </span>
                </span>
              </button>
            </ToolTip>
          </div>
          <div className="w-100 d-flex justify-content-center">
            <ToolTip placement="top" text="Comments">
              <button className="w-100 std-btn-style std-black p-1 post-footer-btn">
                <span className="fw-bold" style={{ fontSize: "1.1rem" }}>
                  <i className="bi bi-chat-fill"></i>&nbsp;
                  {commentCount(item).length > 0
                    ? commentCount(item).length
                    : ""}
                </span>
              </button>
            </ToolTip>
          </div>
          <div className="w-100 d-flex justify-content-center">
            <ToolTip placement="top" text="View Post">
              <button
                className="w-100 std-btn-style std-black p-1 post-footer-btn"
                onClick={() => openShowPostModal(item, index)}
              >
                <span style={{ fontSize: "1.1rem" }}>
                  <i className="bi bi-box-arrow-up-right"></i>
                </span>
              </button>
            </ToolTip>
          </div>
        </div>
      </div>
    ));
  };
  return (
    <Fragment>
      <ShowPostModal ref={showPostModalRef} />
      <EditPostModal ref={editPostModalRef} />
      <DeletePostModal ref={deletePostModalRef} />
      {dashboardPostList()}
      <div className="d-flex align-items-center justify-content-center">
        {post.length > 0 ? (
          <Button
            ref={btnLoadMoreRef}
            variant="dark"
            size="sm"
            onClick={() => {
              loadMorePostRef.current.toggleSpinner();
              setPostLimit(postLimit + 5);
              setPostReloader(!postReloader);
            }}
          >
            Load more&nbsp;
            <SpinnerLoad animation="border" size="sm" ref={loadMorePostRef} />
          </Button>
        ) : (
          ""
        )}
      </div>
    </Fragment>
  );
};

export default DashboardPost;
