/* eslint-disable react-hooks/exhaustive-deps */
import Nav from "../../components/common/Nav";
import classes from "./MyProfile.module.css";

import ProfileMenu from "../../components/Profile/ProfileMenu";
import ProfileMain from "../../components/Profile/ProfileMain";
import FollowButton from "../../components/Profile/FollowButton";
import FollowList from "../../components/Profile/FollowList";

import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
//로그인
import { useDispatch, useSelector } from "react-redux";
// 로그인 시 필요한 함수
import allAuth from "../../components/User/allAuth";

//회원탈퇴
import { useNavigate } from "react-router";

import { removeCookieToken } from "../../components/User/CookieStorage";
import { DELETE_TOKEN } from "../../store/TokenSlice";

import { Logoutstate } from "../../store/LoginSlice";

function MyProfile() {
  //------------------------------로그인 시작
  const dispatch = useDispatch();
  const AccsesToken = useSelector((state) => state.authToken.accessToken);

  // api 요청 후 받아온 user 정보 (모듈화 진행)
  // const baseURL = "https://i9b308.p.ssafy.io"; // 배포용으로 보내면, 아직 확인불가(develop에서만 확인가능)
  const baseURL = "http://localhost:8080"; // 개발용

  const params = useParams();
  const [user, setUser] = useState([]);

  useEffect(() => {
    axios
      .get(`${baseURL}/api/mypage/${params.memberId}`, {
        headers: { Authorization: AccsesToken },
      })
      .then((response) => {
        setUser(response.data);
        // console.log("user");
        // console.log(response.data);
      })
      .catch((error) => {
        // console.log(error);
      });
  }, []);

  // const NowUser = sessionStorage.getItem("user");

  // 만약 회원 정보 수정에서 사용자가 닉네임을 변경했다면, ssessionStorage에 저장된 user 정보를 업데이트 해줘야 함
  // const updateNowUser = () => {
  //   sessionStorage.setItem("user");
  // };

  const [Menu, setMenu] = useState(0);

  const [FollowButtonClick, setFollowButtonClick] = useState(false);

  const navigate = useNavigate();
  const handleunregister = async () => {
    //백에 요청 날리고
    const data = {
      headers: {
        Authorization: AccsesToken,
      },
    };
    if (window.confirm("정말로 탈퇴하시겠습니까?")) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/api/members/withdrawal`,
          data
        );
        //logoutpage 하기
        // store에 저장된 Access Token 정보를 삭제
        dispatch(DELETE_TOKEN());
        // Cookie에 저장된 Refresh Token 정보를 삭제
        removeCookieToken();
        dispatch(Logoutstate());
        sessionStorage.clear();
        navigate("/");
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("회원탈퇴를 취소하셨습니다.");
    }
  };
  //회원정보 수정
  const nicknameinput = useRef();
  const stMsginput = useRef();
  const [selectedFile, setSelectedFile] = useState(null);

  const thumbnailInput = useRef();
  const handleClick = () => {
    thumbnailInput.current?.click();
  };
  // createObjectURL 방식
  const createImageURL = (fileBlob) => {
    //createObjectURL을 사용하여 생성한 URL을 사용한 후에는
    //revokeObjectURL을 호출하여 메모리 누수를 방지
    if (URLThumbnail) URL.revokeObjectURL(URLThumbnail);

    const url = URL.createObjectURL(fileBlob);

    setURLThumbnail(url);
  };

  //edit모드인지 수정
  const handleUserEdit = () => {
    setIsUserEdit(true);
  };

  // 에딧 모드 취소
  const handleCancle = () => {
    setUser(oriuser);
    setIsUserEdit(false);
  };

  // 변동 사항(파일)
  const handleFileChange = (e) => {
    //set preview image
    const { files } = e.target;

    if (!files || !files[0]) return;

    const uploadImage = files[0];

    createImageURL(uploadImage);
    setSelectedFile(uploadImage);
  };

  // 변동 사항(input)
  const handleChangeState = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
    console.log(e.target.value);
  };

  //제출
  const handleSubmit = () => {
    if (user.nickname.length < 1) {
      alert("닉네임 입력");
      nicknameinput.current.focus();
      return;
    }
    if (user.stMsg === null || user.stMsg.length < 1) {
      alert("상태 입력");
      stMsginput.current.focus();
      return;
    }
    const formData = new FormData();
    const data = {
      nickname: user.nickname,
      stMsg: user.stMsg,
      file: user.file,
    };
    console.log(selectedFile);

    formData.append(
      "request",
      new Blob([JSON.stringify(data)], {
        type: "application/json",
      })
    );
    formData.append("file", selectedFile);

    //백이랑 통신
    axios
      .put(
        `${process.env.REACT_APP_BASE_URL}/api/members/${memberId}`,
        formData,
        {
          headers: {
            Authorization: AccsesToken,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        console.log(res);
        //edit모드 false로 바꾸기
        setIsUserEdit(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Nav />
      <div className={classes.MyProfile}>
        {/* 화면 왼쪽 개인 정보 */}
        <div className={classes.UserProfile}>
          <div className={classes.UserInfo}>
            <img
              className={classes.ProfileImg}
              src={user.profilePath}
              alt={user.Userprofilepic}
            />
            <p className={classes.ProfilenNickName}>{user.nickname}</p>
            <p className={classes.ProfileMsg}>{user.stMsg}</p>
            {/* 닉네임/프로필 바꿀 수 있는 옵션 화면 추가 */}
            {/* 팔로잉/팔로워 */}
            <div className={classes.UserFollow}>
              <FollowButton
                memberId={params.memberId}
                setFollowButtonClick={setFollowButtonClick}
              />
            </div>
            <button onClick={() => handleunregister()}>회원 탈퇴</button>
          </div>
          <hr />
          <div className={classes.UserProfileMenu}>
            <ProfileMenu
              setMenu={setMenu}
              setFollowButtonClick={setFollowButtonClick}
              memberId={params.memberId}
            />
          </div>
        </div>
        {/* 화면 오른쪽 화면 출력 창 */}

        <div className={classes.Profilecontent}>
          {FollowButtonClick ? (
            <FollowList memberId={params.memberId} />
          ) : (
            <ProfileMain Menu={Menu} />
          )}
          {/* <ProfileMain Menu={Menu} /> */}
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
