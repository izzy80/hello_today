import Nav from "../../components/common/Nav";
import MainBanner from "../../components/common/MainBanner";
import GroupRoom from "../../components/group/GroupRoom";
import classes from "./GroupRoutine.module.css";
import Modal from "react-modal";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";

//로그인
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// 로그인 시 필요한 함수
import allAuth from "../../components/User/allAuth";

function GroupRoutine() {
  // TODO: DB에서 생성된 방들 데이터 받아와서 컴포넌트로 뿌려줄 것
  // useEffect(() => {...},[])

  const navigate = useNavigate();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [memberCount, setMemberCount] = useState(2);
  const [roomName, setRoomName] = useState("");
  const [roomDesc, setRoomDesc] = useState("");

  const [myUserName, setMyUserName] = useState("홍길동");
  const roomId = "sessiontest0001010112312351";
  const videoEnabled = true;
  const audioEnabled = true;

  const groupRoutineBannerImg = "main_banner_groupRoutine1";
  const groupRoutineBannerMents = [
    "오늘 루틴을 챙기기 버거웠나요?",
    "너무 자책하지 말아요!",
    "다른 오늘러들과 얘기나누며 다시 시작해봐요.",
  ];

  // function

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleIncrement = () => {
    if (memberCount < 6) {
      setMemberCount(memberCount + 1);
    }
  };

  const handleDecrement = () => {
    if (memberCount > 2) {
      setMemberCount(memberCount - 1);
    }
  };

  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value);
  };

  const handleRoomDescChange = (event) => {
    setRoomDesc(event.target.value);
  };

  const enterRoom = () => {
    navigate("/roomId", {
      state: {
        roomId: roomId,
        myUserName: myUserName,
        videoEnabled: videoEnabled,
        audioEnabled: audioEnabled,
      },
    });
  };

  const handleMakeRoomInfo = () => {
    // TODO: 형식 정해지면 axios 보내기 + openvidu 방 생성 로직 들어가야할 듯!
    console.log(roomName, roomDesc, memberCount);
    if (roomName && roomDesc) {
      console.log(`방 제목 : ${roomName}`);
      console.log(`방 설명 : ${roomDesc}`);
      console.log(`방 제한 인원 : ${memberCount}`);
      // 1. axios.post : 생성된 방의 정보 보내주는 로직
      // 2. 생성 즉시 방으로 입장
      enterRoom();
    } else if (!roomName) {
      alert("방제목을 설정해주세요");
    } else if (!roomDesc) {
      alert("방설명을 설정해주세요");
    }
  };

  // Modal style
  const modalStyle = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.6)",
      zIndex: 10,
    },
    content: {
      display: "flex",
      flexDirextion: "column",
      justifyContent: "center",
      backgroundColor: "rgba(255,255,255,0.95)",
      overflow: "auto",
      zIndex: 10,
      top: "300px",
      left: "300px",
      right: "300px",
      bottom: "200px",
      border: "5px solid black",
      borderRadius: "20px",
    },
  };
  //------------------------------로그인 시작
  const dispatch = useDispatch();
  const isAccess = useSelector((state) => state.authToken.accessToken);

  useEffect(() => {
    allAuth(isAccess, dispatch);
  }, [dispatch]);
  //-----------------------------------여기까지

  return (
    <div>
      <Nav />

      <MainBanner
        bannerImg={groupRoutineBannerImg}
        bannerMent={groupRoutineBannerMents}
      />
      {/* 그룹 채팅방 섹션 */}
      <div className={classes.GroupRoomSection}>
        <GroupRoom />
      </div>
      <hr className={classes.divideLine} />
      {/* 하단 방만들기 배너 */}
      <div className={classes.makeRoom}>
        <div className={classes.makeRoomLeft}>
          <p className={classes.makeRoomLeftTitle}>
            지금 당장 원하는 방이 없으신가요?
          </p>
          <p className={classes.makeRoomLeftDesc}>
            내가 원하는 방이 없으시다면
          </p>
          <p className={classes.makeRoomLeftDesc}>
            직접 방을 개설해 보시는건 어떠세요?
          </p>

          <button onClick={openModal} className={classes.makeRoomLeftBtn}>
            방 생성하기
          </button>
        </div>
        <div className={classes.makeRoomRight}>
          <img
            className={classes.makeRoomRightImg}
            src="images/BannerImage/GroupRoutineFooterBanner.png"
            alt="toGroupBanner"
          />
        </div>
      </div>
      <Modal
        style={modalStyle}
        isOpen={modalIsOpen}
        onRequestClose={() => closeModal(false)}
      >
        <div className={classes.makeRoomModal}>
          <FontAwesomeIcon
            onClick={closeModal}
            icon={faCircleXmark}
            className={classes.modalClose}
          />
          <div className={classes.makeRoomModalTitle}>
            <p>단체 루틴방 생성하기</p>
          </div>
          <div className={classes.makeRoomModalMain}>
            <div className={classes.makeRoomModalMainRoomTitle}>
              <label
                className={classes.makeRoomModalMainRoomTitleLabel}
                htmlFor="roomName"
              >
                방 이름 :{" "}
              </label>
              <input
                className={classes.makeRoomModalMainRoomTitleInput}
                type="text"
                id="roomName"
                value={roomName}
                onChange={handleRoomNameChange}
                placeholder="방 제목을 입력해주세요."
              />
            </div>
            <div className={classes.makeRoomModalMainRoomDesc}>
              <label
                htmlFor="roomDesc"
                className={classes.makeRoomModalMainRoomDescLabel}
              >
                방 설명 :{" "}
              </label>
              <textarea
                name=""
                id="roomDesc"
                className={classes.makeRoomModalMainRoomDescInput}
                value={roomDesc}
                onChange={handleRoomDescChange}
                placeholder="방에 대한 설명을 작성해주세요."
              ></textarea>
            </div>
            <div className={classes.makeRoomModalMainRoomCount}>
              <label
                className={classes.makeRoomModalMainRoomCountLabel}
                htmlFor=""
              >
                인원 수 :{" "}
              </label>
              <div className={classes.makeRoomModalMainRoomCountInputSection}>
                <button
                  onClick={handleDecrement}
                  className={classes.makeRoomModalMainRoomCountMinusBtn}
                >
                  -
                </button>
                <input
                  type="number"
                  required
                  value={memberCount}
                  min={2}
                  max={6}
                  className={classes.makeRoomModalMainRoomCountInput}
                />

                <button
                  onClick={handleIncrement}
                  className={classes.makeRoomModalMainRoomCountPlusBtn}
                >
                  +
                </button>
              </div>
              <div className={classes.makeRoomModalMainRoomCountNone}></div>
            </div>
          </div>
          <button
            onClick={handleMakeRoomInfo}
            className={classes.makeRoomModalBtn}
          >
            방 생성하기
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default GroupRoutine;
