type Props = {
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  jackpot?: boolean;
  rewards: { adn: number; shards: number; boostMinutes: number };
  onDone: () => void;
};

const RARITY_GRADIENT: Record<Props['rarity'], string> = {
  mythic: 'game-chest-reveal--mythic',
  legendary: 'game-chest-reveal--legendary',
  epic: 'game-chest-reveal--epic',
  rare: 'game-chest-reveal--rare',
  common: 'game-chest-reveal--common'
};

export default function ChestRevealSequence({ rarity, jackpot, rewards, onDone }: Props) {
  return (
    <div className="game-chest-reveal-overlay">
      <div className={`game-chest-reveal-card ${RARITY_GRADIENT[rarity]}`}>
        <div className="game-eyebrow">Cache Reveal</div>
        <div className="game-chest-reveal-rarity">{rarity.toUpperCase()}</div>
        {jackpot && <div className="game-chest-reveal-jackpot">BÜYÜK VURUŞ</div>}
        <div className="game-chest-reveal-rewards">
          <div>ADN +{rewards.adn}</div>
          <div>Shard +{rewards.shards}</div>
          {rewards.boostMinutes > 0 && <div>Boost +{rewards.boostMinutes}dk</div>}
        </div>
        <button className="game-button game-button--full" onClick={onDone}>
          Devam
        </button>
      </div>
    </div>
  );
}
