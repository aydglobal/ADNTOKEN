export default function RewardToast({ title, body }: { title: string; body: string }) {
  return (
    <div className="game-reward-toast">
      <div className="game-reward-toast__title">{title}</div>
      <div className="game-reward-toast__body">{body}</div>
    </div>
  );
}
