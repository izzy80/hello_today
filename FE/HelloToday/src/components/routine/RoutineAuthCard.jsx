import classes from "./RoutineAuthCard.module.css";

function RoutineAuthCard({
  content,
  routineId,
  imgPath,
  handleModalOpen,
  handleAuthInfo,
}) {
  const selectRoutineImgPath = `images/Routine/${imgPath}`;

  const handleAuthButtonClick = () => {
    handleAuthInfo({ routineId, content });
    handleModalOpen(true);
  };

  return (
    <div className={classes.routineAuthCard}>
      <div className={classes.routineAuthLeft}>
        <div className={classes.routineAuthItem}>
          <img
            className={classes.routineImg}
            src={selectRoutineImgPath}
            alt=""
          />
          <p className={classes.routineName}>{content}</p>
        </div>
      </div>
      <div className={classes.routuneAuthMid}>
        <p className={classes.routineAuthMidDes}>
          "<span style={{ color: "#a581cf" }}>{content}</span>
          "루틴을 진행하셨나요?
        </p>
        <p className={classes.routineAuthMidDes}>
          루틴에 대한 기록을 남겨주세요!
        </p>
      </div>
      <div className={classes.routineAuthRight}>
        <button className={classes.goToAuth} onClick={handleAuthButtonClick}>
          인증하러가기
        </button>
      </div>
    </div>
  );
}

export default RoutineAuthCard;