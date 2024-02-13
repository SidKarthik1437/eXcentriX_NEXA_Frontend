import { useTimer } from "react-timer-hook";

const Timer = ({ color, size, time, onExpire }) => {
  const { seconds, minutes, hours } = useTimer({
    expiryTimestamp: time,
    autoStart: true,
    onExpire: () => {
      {
        onExpire ? onExpire() : null;
      }
    },
  });

  return (
    <div
      className={`flex text-${color} text-${size} font-medium tracking-widest`}
    >
      <span>
        {hours >= 10 ? null : 0}
        {hours}
      </span>
      <span className="">:</span>
      <span>
        {minutes >= 10 ? null : 0}
        {minutes}
      </span>
      <span className="">:</span>
      <span>
        {seconds >= 10 ? null : 0}
        {seconds}
      </span>
    </div>
  );
};

export default Timer;
