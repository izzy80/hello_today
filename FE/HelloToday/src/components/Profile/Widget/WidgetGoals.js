import classes from "./WidgetGoals.module.css";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Swal from "sweetalert2";

import axios from "axios";

function WidgetGoals() {
  const AccsesToken = useSelector((state) => state.authToken.accessToken);
  const memberId = useParams().memberId;

  const [isMe, setIsMe] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [goal, setGoal] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const [editedGoal, setEditedGoal] = useState("");
  const [editedGoalId, setEditedGoalId] = useState(null);
  const [goalType, setGoalType] = useState("0");
  const [editedGoalType, setEditedGoalType] = useState("0");
  const itemsIncludePage = 2; // 페이지당 아이템 수
  const [nowPage, setNowPage] = useState({});
  const [groupedData, setGroupedData] = useState({});
  const [totalPages, setTotalPages] = useState({});

  // const [nowPage, setNowPage] = useState(1);
  // const itemsIncludePage = 4;

  const getGoal = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/mypage/goal/${memberId}`, {
        params: { memberId },
        headers: { Authorization: AccsesToken },
      })
      .then((response) => {
        // console.log(response.data);
        setGoal(response.data);
        const grouped = {};
        goal.forEach((item) => {
          if (!grouped[item.type]) {
            grouped[item.type] = [];
            setNowPage((prev) => ({ ...prev, [item.type]: 1 })); // 초기 페이지 설정
          }
          grouped[item.type].push(item);
        });
        setGroupedData(grouped);

        const total = {};
        Object.keys(grouped).forEach((type) => {
          total[type] = Math.ceil(grouped[type].length / itemsIncludePage);
        });
        setTotalPages(total);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const loggedInUserId = sessionStorage.getItem("memberId");
    setIsMe(
      loggedInUserId === memberId ||
        goal.some((goalItem) => goalItem.memberId === loggedInUserId)
    );
    getGoal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberId, AccsesToken, goal]);

  const createGoal = () => {
    if (newGoal.trim() === "") {
      return;
    }
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/api/mypage/goal`,
        {
          type: goalType,
          content: newGoal,
        },
        {
          headers: { Authorization: AccsesToken },
        }
      )
      .then((response) => {
        // console.log(response.data);
        setNewGoal("");
        setGoalType("0");
        getGoal();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const editGoal = (goalId) => {
    if (editedGoal.trim() === "") {
      return;
    }
    axios
      .put(
        `${process.env.REACT_APP_BASE_URL}/api/mypage/goal/${goalId}`,
        {
          type: editedGoalType,
          content: editedGoal,
        },
        {
          headers: { Authorization: AccsesToken },
        }
      )
      .then((response) => {
        // console.log(response);
        setEditedGoal("");
        setEditedGoalType("0");
        getGoal();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const saveEditedGoal = () => {
    editGoal(editedGoalId, editedGoal);
    setIsEdit(false);
    setEditedGoalId("");
  };

  const deleteAlert = (messageId) => {
    let confirmed = false;

    Swal.fire({
      icon: "question",
      title: "해당 목표를 삭제합니다.",
      text: "소중한 목표를 정말 삭제하시겠습니까?",
      confirmButtonText: "확인",
      cancelButtonText: "취소",
      showCancelButton: true,
    }).then((response) => {
      if (response.isConfirmed) {
        confirmed = true;
        deleteGoal(messageId);
      }
    });
  };

  const deleteGoal = (goalId) => {
    axios
      .delete(
        `${process.env.REACT_APP_BASE_URL}/api/mypage/goal/${goalId}`,
        // { params: { oneDiaryId: wishDiaryId } },
        {
          headers: { Authorization: AccsesToken },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "해당 목표가 삭제되었습니다.",
            text: "",
            confirmButtonText: "확인",
          });
        }
        // console.log(response);
        getGoal();
      })

      .catch((error) => {
        console.log(error);
      });
  };
  const handlePageChange = (type, pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages[type]) {
      if (nowPage[type] !== pageNumber) {
        setNowPage((prev) => ({ ...prev, [type]: pageNumber }));
      }
    }
  };

  const keyPressHandler = (e) => {
    if (e.key === "Enter") {
      createGoal();
    }
  };
  // const indexOfLastItem = nowPage * itemsIncludePage;
  // const indexOfFirstItem = indexOfLastItem - itemsIncludePage;

  // const startIndex = Math.max(indexOfFirstItem, 0);
  // const endIndex = Math.min(indexOfLastItem, goal.length);

  // const nowgoal = goal.length === 0 ? [] : goal.slice(startIndex, endIndex);

  // const paginate = (pageNumber) => {
  //   setNowPage(pageNumber);
  // };

  return (
    <div className={classes.WidgetGoals}>
      <span className={classes.goalTitle}> 나의 목표 </span>
      {/* <p className={classes.goalTitle}> 작고 소중한 목표를 세웠어요! </p> */}
      <div>
        <div className={classes.goalListSection}>
          <div className={classes.goalList}>
            {["0", "1", "2"].map((type) => (
              <div key={type} className={classes.goalContainer}>
                <h2 className={classes.goalSemitTitle}>
                  {type === "0" ? "매일" : type === "1" ? "매주" : "매월"}
                </h2>
                {groupedData[type] && groupedData[type].length > 0 ? (
                  <div className={classes.goalContentPage}>
                    {groupedData[type]
                      .slice(
                        (nowPage[type] - 1) * itemsIncludePage,
                        nowPage[type] * itemsIncludePage
                      )
                      .map((item) => (
                        <div
                          key={item.goalId}
                          className={classes.goalOneItemContainer}
                        >
                          {/* 데이터 있는데 수정모드일때  */}
                          {isEdit && editedGoalId === item.goalId ? (
                            <div className={classes.editSectionStyle}>
                              <select
                                value={editedGoalType}
                                className={classes.selectBoxStyle}
                                onChange={(event) =>
                                  setEditedGoalType(event.target.value)
                                }
                              >
                                <option value="0">매일</option>
                                <option value="1">매주</option>
                                <option value="2">매년</option>
                              </select>
                              <input
                                type="text"
                                value={editedGoal}
                                className={classes.editInputStyle}
                                onChange={(event) => {
                                  setEditedGoal(event.target.value);
                                  setEditedGoalId(item.goalId);
                                }}
                              />
                              <button
                                className={classes.inputBtnMini}
                                onClick={() => saveEditedGoal()}
                              >
                                저장
                              </button>
                              <button
                                className={classes.inputBtnMini}
                                onClick={() => setIsEdit(false)}
                              >
                                취소
                              </button>
                            </div>
                          ) : (
                            // 데이터가 있는데 수정 모드가 아닐때
                            <div className={classes.goalOneItemGet}>
                              <div className={classes.goalOneItemGetContent}>
                                {item.content}
                              </div>
                              {isMe && (
                                <div>
                                  <button
                                    className={classes.editButtonStyle}
                                    onClick={() => {
                                      setIsEdit(true);
                                      setEditedGoalId(item.goalId);
                                      setEditedGoal(item.content);
                                      setEditedGoalType(item.type);
                                    }}
                                  >
                                    <img
                                      src="../../images/Widget/edit.png"
                                      alt="edit"
                                    />
                                  </button>
                                  <button
                                    className={classes.editButtonStyle}
                                    onClick={() => deleteAlert(item.goalId)}
                                  >
                                    <img
                                      src="../../images/Widget/clear.png"
                                      alt="clear"
                                    />
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    <div className="pagination">
                      <button
                        className={classes.goalPageBtn}
                        onClick={() =>
                          handlePageChange(type, nowPage[type] - 1)
                        }
                        disabled={nowPage[type] === 1}
                      >
                        이전
                      </button>
                      {Array.from({ length: totalPages[type] }, (_, index) => (
                        <button
                          key={index}
                          onClick={() => handlePageChange(type, index + 1)}
                          className={
                            nowPage[type] === index + 1
                              ? `${classes.goalPageBtnActive}`
                              : `${classes.goalPageBtn}`
                          }
                        >
                          {index + 1}
                        </button>
                      ))}
                      <button
                        className={classes.goalPageBtn}
                        onClick={() =>
                          handlePageChange(type, nowPage[type] + 1)
                        }
                        disabled={nowPage[type] === totalPages[type]}
                      >
                        다음
                      </button>
                    </div>
                  </div>
                ) : (
                  // 데이터가 아무것도 없을 때
                  <div>
                    <div>
                      <h2 className={classes.goalNothingText}>
                        {type === "0"
                          ? "매일 "
                          : type === "1"
                          ? "매주 "
                          : "매월 "}
                        목표를 입력해주세요
                      </h2>
                    </div>
                    <div className="pagination">
                      <button disabled className={classes.goalPageBtnNot}>
                        이전
                      </button>
                      <button className={classes.goalPageBtnActive}>1</button>
                      <button disabled className={classes.goalPageBtnNot}>
                        다음
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          {/* 목표 등록 창 */}
          {isMe && (
            <div className={classes.widgetInputStyle}>
              <select
                value={goalType}
                className={classes.selectBoxStyle}
                onChange={(event) => setGoalType(event.target.value)}
              >
                <option className={classes.selectBoxOption} value="0">
                  매일
                </option>
                <option className={classes.selectBoxOption} value="1">
                  매주
                </option>
                <option className={classes.selectBoxOption} value="2">
                  매년
                </option>
              </select>
              <input
                type="text"
                value={newGoal}
                className={classes.inputstyle}
                placeholder="해내고 싶은 목표를 남겨봐요!"
                onChange={(event) => setNewGoal(event.target.value)}
                onKeyDown={keyPressHandler}
              />
              <button className={classes.inputBtn} onClick={() => createGoal()}>
                저장
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WidgetGoals;
