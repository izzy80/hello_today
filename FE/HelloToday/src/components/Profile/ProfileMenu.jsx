import classes from "./ProfileMenu.module.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import WidgetComments from "./Widget/WidgetComments";
import WidgetGroupRoutine from "./Widget/WidgetGroupRoutine";
import WidgetBucket from "./Widget/WidgetBucket";
import WidgetGoals from "./Widget/WidgetGoals";
import WidgetDiary from "./Widget/WidgetDiary";
import WidgetHistory from "./Widget/WidgetHistory";
import WidgetGallery from "./Widget/WidgetGallery";
import WidgetDday from "./Widget/WidgetDday";
import { useLocation } from "react-router-dom";

function ProfileMenu({ setMenu, setFollowButtonClick, memberId, Token }) {
  const MenuList = {
    "응원 메세지": <WidgetComments memberId={memberId} />,
    "단체 루틴을 함께한 사람": <WidgetGroupRoutine memberId={memberId} />,
    버킷리스트: <WidgetBucket memberId={memberId} />,
    "소중한 목표": <WidgetGoals memberId={memberId} />,
    "한 줄 일기": <WidgetDiary memberId={memberId} />,
    "나의 루틴들": <WidgetHistory memberId={memberId} />,
    갤러리: <WidgetGallery memberId={memberId} />,
    "D-Day": <WidgetDday memberId={memberId} />,
    "편집 모드": <Link to="/MyProfile/edit"></Link>,
  };

  const location = useLocation();
  const [selectedFlags, setSelectedFlags] = useState([]);

  console.log(location);
  const widgetAxios = async () => {
    axios({
      url: `${process.env.REACT_APP_BASE_URL}/api/mypage/widget`,
      method: "get",
      headers: {
        Authorization: Token,
      },
    }).then((res) => {
      // console.log(res);
      const newData = [];
      const data = res.data;
      newData.push("응원 메세지");

      if (data.ddayFlag === 1) {
        newData.push("D-Day");
      }

      if (data.galleryFlag === 1) {
        newData.push("갤러리");
      }
      if (data.goalFlag === 1) {
        newData.push("소중한 목표");
      }
      if (data.oneDiaryFlag === 1) {
        newData.push("한 줄 일기");
      }
      if (data.routineHistoryFlag === 1) {
        newData.push("나의 루틴들");
      }
      if (data.wishListFlag === 1) {
        newData.push("버킷리스트");
      }
      newData.push("편집 모드");
      setSelectedFlags(newData);
    });
    // .catch(console.log(userName));
  };

  useEffect(() => {
    widgetAxios();
  }, []);

  const UserSelectMenu = (event) => {
    // console.log(event.target.innerText);
    setMenu(MenuList[event.target.innerText]);
    setFollowButtonClick(false);
  };

  useEffect(() => {
    setMenu(<WidgetComments memberId={memberId} />);
  }, []);

  return (
    <div className={classes.UserProfileMenu}>
      {selectedFlags.map((flag) => (
        <div className={classes.ProfileMenu} key={flag}>
          {flag === "편집 모드" ? (
            <Link to="/MyProfile/edit">
              <button className={classes.ProfileItem}>{flag}</button>
            </Link>
          ) : (
            <button
              className={classes.ProfileItem}
              onClick={(event) => {
                UserSelectMenu(event);
              }}
            >
              {flag}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default ProfileMenu;
