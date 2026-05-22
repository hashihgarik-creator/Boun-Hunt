const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
const gameOverOverlay = document.getElementById("gameOverOverlay");
const victoryOverlay = document.getElementById("victoryOverlay");
const finalBonesEl = document.getElementById("finalBones");
const victoryBonesEl = document.getElementById("victoryBones");
const menuBtn = document.getElementById("menuBtn");
const victoryMenuBtn = document.getElementById("victoryMenuBtn");
const gameHud = document.getElementById("gameHud");
const hudBonesEl = document.getElementById("hudBones");
const hudHpEl = document.getElementById("hudHp");
const hudMaxHpEl = document.getElementById("hudMaxHp");

const mainMenu = document.getElementById("mainMenu");
const shopMenu = document.getElementById("shopMenu");
const recordsMenu = document.getElementById("recordsMenu");
const developerMenu = document.getElementById("developerMenu");
const secretMenu = document.getElementById("secretMenu");
const shopList = document.getElementById("shopList");

const totalBonesEl = document.getElementById("totalBones");
const maxBonesDisplayEl = document.getElementById("maxBonesDisplay");
const shopBonesEl = document.getElementById("shopBones");
const recordsMaxBonesEl = document.getElementById("recordsMaxBones");
const recordsTotalBonesEl = document.getElementById("recordsTotalBones");

const SFX_VOLUME = 0.5;

const fireSound = new Audio("sounds/cannon_fire.mp3");
fireSound.volume = SFX_VOLUME;

const boss1CannonSound = new Audio("sounds/boss1_cannon.mp3");
boss1CannonSound.volume = 0.6;

const sounds = {
  enemyShootSound: new Audio("sounds/enemy_shoot.mp3"),
  hitSound: new Audio("sounds/hit.mp3"),
  explosionSound: new Audio("sounds/explosion.mp3"),
  gameOverSound: new Audio("sounds/gameover.mp3"),
};

const clickSound = new Audio("sounds/soundsclick.mp3");
clickSound.volume = 0.5;

const ENEMY_EXPLOSION_VOLUME = 0.5;
const enemyExplosionSound = new Audio("sounds/enemy_explosion.mp3");
enemyExplosionSound.volume = ENEMY_EXPLOSION_VOLUME;

const menuMusic = new Audio("sounds/pirates_theme.mp3");
menuMusic.loop = true;
menuMusic.volume = 0.4;

const sea2Music = new Audio("sounds/sea2_theme.mp3");
sea2Music.loop = true;
const SEA2_MUSIC_VOLUME = 0.3;
sea2Music.volume = SEA2_MUSIC_VOLUME;

const krakenMusic = new Audio("sounds/kraken_theme.mp3");
krakenMusic.loop = true;
krakenMusic.volume = 0.4;
krakenMusic.addEventListener("ended", function () {
  this.currentTime = 0;
  this.play().catch(() => {});
});

const KRAKEN_SFX_VOLUME = 0.7;
const krakenSpawnSound = new Audio("sounds/kraken_spawn.mp3");
const krakenAttackSound = new Audio("sounds/kraken_attack.mp3");
const krakenLowHpSound = new Audio("sounds/kraken_low_hp.mp3");
const krakenDeathSound = new Audio("sounds/kraken_death.mp3");
krakenSpawnSound.volume = KRAKEN_SFX_VOLUME;
krakenAttackSound.volume = KRAKEN_SFX_VOLUME;
krakenLowHpSound.volume = KRAKEN_SFX_VOLUME;
krakenDeathSound.volume = KRAKEN_SFX_VOLUME;

let menuMusicUnlocked = false;

const STORAGE = {
  totalBones: "boneHunt_totalBones",
  maxBones: "boneHunt_maxBones",
  selectedShip: "pirateRunner_selectedShip",
  ownedShips: "pirateRunner_ownedShips",
};

const STORAGE_LEGACY = {
  totalBones: "pirateRunner_totalCoins",
  maxBones: "pirateRunner_highScore",
};

const ASSET_VERSION = 21;

const reefImg = new Image();
reefImg.src = `images/imagesreef.png?v=${ASSET_VERSION}`;

const barrelImg = new Image();
barrelImg.src = `images/imagesfire_barrel.png?v=${ASSET_VERSION}`;

const turtleImg = new Image();
turtleImg.src = `images/2sea/turtle_boss.png?v=${ASSET_VERSION}`;

const sea2Water1 = new Image();
sea2Water1.src = `images/2sea/water1.png?v=${ASSET_VERSION}`;
const sea2Water2 = new Image();
sea2Water2.src = `images/2sea/water2.png?v=${ASSET_VERSION}`;
const sea2Water3 = new Image();
sea2Water3.src = `images/2sea/water3.png?v=${ASSET_VERSION}`;

const sea2KrakenAlive = new Image();
sea2KrakenAlive.src = `images/2sea/kraken_alive.png?v=${ASSET_VERSION}`;
const sea2KrakenDead = new Image();
sea2KrakenDead.src = `images/2sea/kraken_dead.png?v=${ASSET_VERSION}`;

const tentacleImg = new Image();
tentacleImg.src = `images/2sea/kraken_tentacle.png?v=${ASSET_VERSION}`;

const whirlpoolImg = new Image();
whirlpoolImg.src = `images/2sea/whirlpool.png?v=${ASSET_VERSION}`;

const questionMarkImg = new Image();
questionMarkImg.src = `images/2sea/question_mark.png?v=${ASSET_VERSION}`;
const laserImg = new Image();
laserImg.src = `images/2sea/laser.png?v=${ASSET_VERSION}`;

const WATER_TILE_KEYS = ["water1", "water2", "water3"];

const IMAGE_PATHS = {
  water1: "images/water_tile1.png",
  water2: "images/water_tile2.png",
  water3: "images/water_tile3.png",
  rowboat: "images/rowboat.webp",
  shipBrig: "images/ship_brig.webp",
  shipGalleon: "images/ship_galleon.webp",
  shipCorsair: "images/ship_corsair.webp",
  enemyScout: "images/enemy_scout.png",
  enemyKamikaze: "images/enemy_kamikaze.png",
  enemySniper: "images/enemy_sniper.png",
  enemyBoss: "images/enemy_boss.png",
  bochkaRepair: "images/bochka_repair.png",
  bulletPlayer: "images/imagesbullet_player.png",
  bulletEnemy: "images/imagesbullet_enemy.png",
};

const sprites = {};
Object.entries(IMAGE_PATHS).forEach(([key, src]) => {
  const img = new Image();
  img.src = `${src}?v=${ASSET_VERSION}`;
  sprites[key] = img;
});

function isImageReady(img) {
  return Boolean(img && img.naturalWidth > 0 && img.naturalHeight > 0);
}

const spriteCacheByPath = {};

function getSpriteByPath(path) {
  if (!path) return null;

  if (spriteCacheByPath[path]) {
    return spriteCacheByPath[path];
  }

  const entry = Object.entries(IMAGE_PATHS).find(([, src]) => src === path);
  if (entry) {
    spriteCacheByPath[path] = sprites[entry[0]];
    return spriteCacheByPath[path];
  }

  const img = new Image();
  img.src = `${path}?v=${ASSET_VERSION}`;
  spriteCacheByPath[path] = img;
  return img;
}

const SHIP_TYPES = [
  {
    id: "sloop",
    name: "Шлюп",
    price: 0,
    hp: 3,
    speed: 280,
    width: 54,
    height: 78,
    image: "images/rowboat.webp",
    weaponType: "single",
    hull: "#8b4513",
    mast: "#c4a35a",
  },
  {
    id: "brig",
    name: "Бриг",
    price: 500,
    hp: 4,
    speed: 300,
    width: 60,
    height: 88,
    image: "images/ship_brig.webp",
    weaponType: "double",
    hull: "#4a6741",
    mast: "#d4c4a8",
  },
  {
    id: "galleon",
    name: "Галеон",
    price: 1500,
    hp: 5,
    speed: 250,
    width: 66,
    height: 96,
    image: "images/ship_galleon.webp",
    weaponType: "spread",
    hull: "#5c4033",
    mast: "#e8c170",
  },
  {
    id: "corsair",
    name: "Корсар",
    price: 3000,
    hp: 3,
    speed: 340,
    width: 52,
    height: 82,
    image: "images/ship_corsair.webp",
    weaponType: "fast",
    hasShield: true,
    hull: "#2a1a3a",
    mast: "#c45c8a",
  },
];

const MENU_SCREENS = [mainMenu, shopMenu, recordsMenu, developerMenu, secretMenu];

function playClonedSound(audio) {
  if (!audio) return;
  try {
    audio.cloneNode(true).play();
  } catch (_) {}
}

function playEnemyExplosionSound() {
  try {
    const sound = enemyExplosionSound.cloneNode();
    sound.volume = ENEMY_EXPLOSION_VOLUME;
    sound.play().catch(() => {});
  } catch (_) {}
}

function playSound(audio) {
  if (!audio) return;
  try {
    audio.currentTime = 0;
    audio.play();
  } catch (_) {}
}

function playCannonFireSound() {
  try {
    fireSound.currentTime = 0;
    fireSound.play();
  } catch (_) {}
}

function playBoss1CannonSound() {
  if (!getActiveBoss()) return;
  try {
    boss1CannonSound.currentTime = 0;
    boss1CannonSound.play();
  } catch (_) {}
}

function playKrakenSfx(audio) {
  if (!audio) return;
  try {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } catch (_) {}
}

function playKrakenAttackSound() {
  playKrakenSfx(krakenAttackSound);
}

function playClickSound() {
  try {
    clickSound.currentTime = 0;
    clickSound.play().catch((err) => {
      console.log("Звук заблокирован браузером до первого взаимодействия:", err);
    });
  } catch (_) {}
}

function stopMenuMusic() {
  menuMusic.pause();
  menuMusic.currentTime = 0;
}

function stopKrakenBossMusic() {
  krakenMusic.pause();
  krakenMusic.currentTime = 0;
}

function startKrakenBossMusic() {
  if (!isPlaying()) return;

  sea2Music.pause();
  krakenMusic.currentTime = 0;
  krakenMusic.volume = 0.4;
  krakenMusic.play().catch(() => {});
}

function resumeSea2MusicAfterKraken() {
  if (!isPlaying() || currentSea !== 2) return;

  stopKrakenBossMusic();
  sea2Music.volume = SEA2_MUSIC_VOLUME;
  sea2Music.play().catch(() => {
    console.log("Музыка ожидает клика пользователя");
  });
}

function stopSea2Music() {
  sea2Music.pause();
  sea2Music.currentTime = 0;
}

function playSea2Music() {
  stopMenuMusic();
  stopKrakenBossMusic();
  stopSea2Music();
  sea2Music.volume = SEA2_MUSIC_VOLUME;
  sea2Music.play().catch(() => {
    console.log("Музыка ожидает клика пользователя");
  });
}

function tryStartMenuMusic() {
  if (isPlaying()) return;

  stopKrakenBossMusic();
  stopSea2Music();
  menuMusicUnlocked = true;
  menuMusic.play().catch(() => {});
}

function initMenuMusic() {
  const unlock = () => {
    tryStartMenuMusic();
    document.removeEventListener("pointerdown", unlock, true);
    document.removeEventListener("keydown", unlock, true);
  };

  document.addEventListener("pointerdown", unlock, true);
  document.addEventListener("keydown", unlock, true);
}

function initUiClickSounds() {
  document.addEventListener(
    "click",
    (e) => {
      const btn = e.target.closest("button");
      if (!btn || btn.disabled) return;
      playClickSound();
    },
    true
  );
}

const W = canvas.width;
const H = canvas.height;

const SEA_COLOR = "#1e6bb8";
const SEA_2_COLOR = "#4a0d0d";
const SEA_TRANSITION_HOLD_MS = 4500;
const SEA_TRANSITION_FADE_MS = 2000;
const SEA_TRANSITION_MS = SEA_TRANSITION_HOLD_MS + SEA_TRANSITION_FADE_MS;
const WATER_SCROLL_SPEED = 52;
const SEA2_WATER_SCROLL_SPEED = 22;
const SEA2_ROW_OVERLAP = 6;
const SEA2_MONSTER_MIN_DELAY_MS = 20000;
const SEA2_MONSTER_MAX_DELAY_MS = 30000;
const INVINCIBLE_MS = 1200;
const SPAWN_INTERVAL_MS = 2000;
const ENEMY_SPAWN_INTERVAL_MS = 1100;
const ENEMY_CONVEYOR_GAP = 95;
const MIN_ENEMIES_ON_SCREEN = 3;
const MAX_ENEMIES_ON_FIELD = 8;
const REEF_SPAWN_INTERVAL_MS = 1500;
const REEF_SPAWN_CHANCE = 0.72;
const MAX_REEFS_ON_FIELD = 3;
const BARREL_W = 54;
const BARREL_H = 54;
const BARREL_EXPLOSION_RADIUS = 130;
const BARREL_SPEED = { min: 46, max: 62 };
const BARREL_SPAWN_INTERVAL_MS = 2600;
const BARREL_SPAWN_CHANCE = 0.36;
const BARREL_SPAWN_MIN_GAP = 82;
const MAX_BARRELS_ON_FIELD = 2;
const FIRST_BARREL_DELAY_MS = 5000;
const GUARANTEED_BARREL_INTERVAL_MS = 12000;

const TURTLE_W = 128;
const TURTLE_H = 72;
const TURTLE_HP = 25;
const TURTLE_SPEED = 32;
const TURTLE_BONES_REWARD = 12;
const TURTLE_COLLISION_DAMAGE = 3;
const MAX_TURTLES_ON_FIELD = 1;
const SEA2_TURTLE_SPAWN_BONES = 100;
const SEA2_BONES_FOR_KRAKEN = 300;
const SEA2_TURTLES_FOR_KRAKEN = 3;
const KRAKEN_QTE_KEY_POOL = ["w", "a", "s", "d"];
const KRAKEN_QTE_LENGTH = 4;
const KRAKEN_SQUEEZE_GRACE_S = 1.5;
const KRAKEN_SQUEEZE_INTERVAL_S = 0.85;
const KRAKEN_ATTACK_DAMAGE = 2;
const KRAKEN_QTE_WRONG_DAMAGE = KRAKEN_ATTACK_DAMAGE;
const KRAKEN_GRAB_SQUEEZE_DAMAGE = KRAKEN_ATTACK_DAMAGE;
const KRAKEN_MAX_HP = 150;
const KRAKEN_DRAW_W = 380;
const KRAKEN_DRAW_H = 300;
const KRAKEN_POS_Y = Math.round(H * 0.14);
const KRAKEN_INTRO_MS = 2800;
const KRAKEN_FIRST_GRAB_DELAY_MS = 5500;
const KRAKEN_GRAB_MIN_MS = 5000;
const KRAKEN_GRAB_MAX_MS = 7000;
const KRAKEN_QTE_SUCCESS_DAMAGE = 10;
const KRAKEN_BULLET_DAMAGE = 1;
const KRAKEN_SINK_SPEED = 48;
const KRAKEN_BONES_REWARD = 80;
const KRAKEN_HITBOX_PAD = 56;
const KRAKEN_TENTACLE_W = 150;
const KRAKEN_TENTACLE_H = 210;
const KRAKEN_GRAB_SINK_SPEED = 30;
const TENTACLE_FADE_MS = 400;
const KRAKEN_WHIRLPOOL_DURATION_MS = 4000;
const KRAKEN_WHIRLPOOL_DAMAGE = KRAKEN_ATTACK_DAMAGE;
const KRAKEN_WHIRLPOOL_DAMAGE_INTERVAL_S = 0.85;
const WHIRLPOOL_W = 132;
const WHIRLPOOL_H = 118;
const WHIRLPOOLS_PER_ARM = 4;
const WHIRLPOOL_INWARD_SPEED = 210;
const WHIRLPOOL_DOWN_SPEED = 150;
const WHIRLPOOL_TRACK_SPEED = 150;
const WHIRLPOOL_SAFE_CORRIDOR_RATIO = 0.34;
const WHIRLPOOL_G_TOP_MAX_Y_RATIO = 0.42;
const KRAKEN_LASER_CHARGE_MS = 1500;
const KRAKEN_LASER_FIRE_MS = 2000;
const KRAKEN_LASER_DAMAGE = KRAKEN_ATTACK_DAMAGE;
const KRAKEN_LASER_DAMAGE_INTERVAL_S = 0.7;
const KRAKEN_QUESTION_MARK_SIZE = 72;
const KRAKEN_LASER_HITBOX_W_RATIO = 0.26;
const EXPLOSION_FX_DURATION_MS = 420;
const SPAWN_LANE_COUNT = 5;
const SPAWN_X_MIN_GAP = 110;
const SPAWN_X_KAMIKAZE_GAP = 130;
const SPAWN_X_MAX_ATTEMPTS = 14;
const BULLET_SPEED = 420;
const PLAYER_BULLET_W = 20;
const PLAYER_BULLET_H = 20;
const ENEMY_BULLET_W = 20;
const ENEMY_BULLET_H = 20;
const FIRE_COOLDOWN_MS = 280;
const FIRE_COOLDOWN_FAST_MS = 150;
const SPREAD_VX = 220;
const SHIELD_RECHARGE_MS = 15000;
const SHIELD_BREAK_IFRAMES_MS = 450;
const BULLET_TYPE = {
  PLAYER: "player",
  ENEMY: "enemy",
};
const ENEMY_BULLET_SPEED = 280;
const SNIPER_BULLET_SPEED = 320;
const SNIPER_APPROACH_SPEED = 210;
const SNIPER_BURST_SHOTS = 2;
const SNIPER_BURST_GAP_MS = 400;
const SNIPER_BURST_COOLDOWN_MS = 2100;
const SNIPER_FIRST_SHOT_DELAY_MS = 280;
const SNIPER_ANCHOR_Y_MIN = 0.12;
const SNIPER_ANCHOR_Y_MAX = 0.24;
const SCOUT_SHOT_MIN_MS = 2800;
const SCOUT_SHOT_MAX_MS = 5000;
const BOSS_ATTACK_INTERVAL_MS = 2200;
const BOSS_SUMMON_INTERVAL_MS = 5000;
const BOSS_FIRST_AT_BONES = 1000;

const ENEMY_KIND = {
  SCOUT: "scout",
  KAMIKAZE: "kamikaze",
  SNIPER: "sniper",
  BOSS: "boss",
};

const ENEMY_LINE_W = 88;
const ENEMY_LINE_H = 174;
const ENEMY_SNIPER_W = 84;
const ENEMY_SNIPER_H = 168;
const ENEMY_BOSS_SIZE = 132;

const ENEMY_DEF = {
  [ENEMY_KIND.SCOUT]: { w: ENEMY_LINE_W, h: ENEMY_LINE_H, speed: 48, bones: 1, sprite: "enemyScout" },
  [ENEMY_KIND.KAMIKAZE]: { w: ENEMY_LINE_W, h: ENEMY_LINE_H, speed: 135, bones: 10, sprite: "enemyKamikaze" },
  [ENEMY_KIND.SNIPER]: {
    w: ENEMY_SNIPER_W,
    h: ENEMY_SNIPER_H,
    speed: SNIPER_APPROACH_SPEED,
    bones: 5,
    sprite: "enemySniper",
  },
  [ENEMY_KIND.BOSS]: { w: ENEMY_BOSS_SIZE, h: ENEMY_BOSS_SIZE, speed: 22, bones: 100, sprite: "enemyBoss", hp: 50 },
};

const REEF_W = 96;
const REEF_H = 80;
const REEF_MAX_HP = 3;
const REEF_SPEED = { min: 44, max: 58 };

const BOOSTER_KIND = {
  REPAIR: "repair",
};

const BOOSTER_REPAIR_SIZE = 52;
const BOOSTER_REPAIR_SPEED = 45;
const BOOSTER_SPAWN_CHANCE = 0.05;
const BOOSTER_KILL_DROP_CHANCE = 0.2;

const progress = {
  totalBones: 0,
  maxBones: 0,
  selectedShipId: "sloop",
  ownedShips: ["sloop"],
};

const player = {
  x: W / 2 - 27,
  y: H - 94,
  width: 54,
  height: 78,
  hull: "#8b4513",
  mast: "#c4a35a",
  image: "images/rowboat.webp",
};

let maxHp = 3;
let playerSpeed = 280;
const keys = { left: false, right: false, up: false, down: false };
let bullets = [];
let enemyBullets = [];
let obstacles = [];
let barrels = [];
let explosionEffects = [];
let enemies = [];
let turtleEnemies = [];
let boosters = [];
let gameStartTime = 0;
let boneGalleonSpawned = false;
let lastFireTime = 0;
let lastSpawnTime = 0;
let lastEnemySpawnTime = 0;
let lastObstacleSpawnTime = 0;
let lastBarrelSpawnTime = 0;
let nextGuaranteedBarrelAt = 0;
let lastFrameTime = 0;
let waterOffsetY = 0;
let waterTileW = 64;
let waterTileH = 64;
let waterCols = 0;
let hasMonsterAppeared = false;
let sea2MonsterRow = null;
let sea2MonsterAllowedAfter = 0;
let sea2TileW = 64;
let sea2TileH = 64;
let sea2WaterCols = 0;
let sea2CropTemplate = null;
let turtleKillCount = 0;
let sea2BonesBaseline = 0;
let sea2TurtlesSpawned = 0;
let isGrabbed = false;
let isLowHpPlayed = false;
let requiredKeys = [];
let currentQteIndex = 0;
let krakenQteErrorUntil = 0;
let krakenSqueezeTimer = 0;
let tentacleFadeUntil = 0;
let whirlpools = [];
let whirlpoolDamageTimer = 0;
let isLaserCharging = false;
let isLaserFiring = false;
let laserTimer = 0;
let laserDamageTimer = 0;

function createKrakenState() {
  return {
    active: false,
    phase: null,
    x: 0,
    y: 0,
    w: KRAKEN_DRAW_W,
    h: KRAKEN_DRAW_H,
    hp: KRAKEN_MAX_HP,
    maxHp: KRAKEN_MAX_HP,
    isDead: false,
    sinking: false,
    introUntil: 0,
    nextAttackAt: 0,
    whirlpoolEndsAt: 0,
    laserChargeEndsAt: 0,
    laserEndsAt: 0,
  };
}

let kraken = createKrakenState();
let bones = 0;
let isShielded = false;
let shieldReadyAt = 0;
let hp = 3;
let invincibleUntil = 0;
let devForceHp = 0;
let devQuickAccessVisible = false;

const GameState = {
  MENU: "menu",
  PLAYING: "playing",
  GAMEOVER: "gameover",
  VICTORY: "victory",
};

let gameState = GameState.MENU;
let currentSea = 1;
let seaTransitionTextUntil = 0;

function isPlaying() {
  return gameState === GameState.PLAYING;
}

function setGameState(state) {
  gameState = state;
}

function clearKeys() {
  keys.left = false;
  keys.right = false;
  keys.up = false;
  keys.down = false;
}

function focusGame() {
  canvas.focus({ preventScroll: true });
  if (document.activeElement !== canvas) {
    window.focus();
  }
}

function loadProgress() {
  progress.totalBones =
    Number(localStorage.getItem(STORAGE.totalBones)) ||
    Number(localStorage.getItem(STORAGE_LEGACY.totalBones)) ||
    0;
  progress.maxBones =
    Number(localStorage.getItem(STORAGE.maxBones)) ||
    Number(localStorage.getItem(STORAGE_LEGACY.maxBones)) ||
    0;
  progress.selectedShipId =
    localStorage.getItem(STORAGE.selectedShip) || "sloop";

  try {
    const owned = JSON.parse(localStorage.getItem(STORAGE.ownedShips) || '["sloop"]');
    progress.ownedShips = Array.isArray(owned) ? owned : ["sloop"];
  } catch {
    progress.ownedShips = ["sloop"];
  }

  if (!progress.ownedShips.includes("sloop")) {
    progress.ownedShips.unshift("sloop");
  }
  if (!progress.ownedShips.includes(progress.selectedShipId)) {
    progress.selectedShipId = "sloop";
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE.totalBones, String(progress.totalBones));
  localStorage.setItem(STORAGE.maxBones, String(progress.maxBones));
  localStorage.setItem(STORAGE.selectedShip, progress.selectedShipId);
  localStorage.setItem(STORAGE.ownedShips, JSON.stringify(progress.ownedShips));
}

function getShip(id) {
  return SHIP_TYPES.find((s) => s.id === id) || SHIP_TYPES[0];
}

function formatNum(n) {
  return n.toLocaleString("ru-RU");
}

function getShipDrawRect(x, y, width, height, sprite) {
  if (!isImageReady(sprite)) {
    return { x, y, w: width, h: height };
  }

  const aspect = sprite.naturalWidth / sprite.naturalHeight;
  let drawW = width;
  let drawH = width / aspect;

  if (drawH > height) {
    drawH = height;
    drawW = height * aspect;
  }

  return {
    x: x + (width - drawW) / 2,
    y: y + (height - drawH) / 2,
    w: drawW,
    h: drawH,
  };
}

function drawSpriteInBox(sprite, boxX, boxY, boxW, boxH) {
  const rect = getShipDrawRect(boxX, boxY, boxW, boxH, sprite);
  const dx = Math.round(rect.x);
  const dy = Math.round(rect.y);
  const dw = Math.round(rect.w);
  const dh = Math.round(rect.h);

  ctx.drawImage(sprite, 0, 0, sprite.naturalWidth, sprite.naturalHeight, dx, dy, dw, dh);
  return { x: dx, y: dy, w: dw, h: dh };
}

function getVerticalShipCrop(sprite) {
  const nw = sprite.naturalWidth;
  const nh = sprite.naturalHeight;
  const contentH = Math.round(nh * 0.84);
  const insetY = Math.round((nh - contentH) / 2);
  const contentW = Math.round(nw * 0.96);
  const insetX = Math.round((nw - contentW) / 2);
  return { sx: insetX, sy: insetY, sw: contentW, sh: contentH };
}

function getBulletCrop(sprite) {
  const nw = sprite.naturalWidth;
  const nh = sprite.naturalHeight;
  const size = Math.round(Math.min(nw, nh) * 0.55);
  const sx = Math.round((nw - size) / 2);
  const sy = Math.round((nh - size) / 2);
  return { sx, sy, sw: size, sh: size };
}

function getBochkaRepairCrop(sprite) {
  const side = Math.min(sprite.naturalWidth, sprite.naturalHeight);
  const content = Math.round(side * 0.44);
  const inset = Math.round((side - content) / 2);
  return { sx: inset, sy: inset, sw: content, sh: content };
}

function drawSpriteCropInBox(sprite, crop, boxX, boxY, boxW, boxH, smooth = false) {
  const aspect = crop.sw / crop.sh;
  let drawW = boxW;
  let drawH = boxW / aspect;

  if (drawH > boxH) {
    drawH = boxH;
    drawW = boxH * aspect;
  }

  const dx = Math.round(boxX + (boxW - drawW) / 2);
  const dy = Math.round(boxY + (boxH - drawH) / 2);
  const dw = Math.round(drawW);
  const dh = Math.round(drawH);
  const prevSmooth = ctx.imageSmoothingEnabled;

  ctx.imageSmoothingEnabled = smooth;
  ctx.imageSmoothingQuality = smooth ? "high" : "low";
  ctx.drawImage(sprite, crop.sx, crop.sy, crop.sw, crop.sh, dx, dy, dw, dh);
  ctx.imageSmoothingEnabled = prevSmooth;

  return { x: dx, y: dy, w: dw, h: dh };
}

function applySelectedShip() {
  const ship = getShip(progress.selectedShipId);
  maxHp = ship.hp;
  playerSpeed = ship.speed;
  player.width = ship.width;
  player.height = ship.height;
  player.hull = ship.hull;
  player.mast = ship.mast;
  player.image = ship.image || null;
}

function updateMenuDisplays() {
  totalBonesEl.textContent = formatNum(progress.totalBones);
  maxBonesDisplayEl.textContent = formatNum(progress.maxBones);
  shopBonesEl.textContent = formatNum(progress.totalBones);
  recordsMaxBonesEl.textContent = formatNum(progress.maxBones);
  recordsTotalBonesEl.textContent = formatNum(progress.totalBones);
}

function showGameHud() {
  gameHud.classList.remove("hidden");
  gameHud.setAttribute("aria-hidden", "false");
  updateGameHud();
}

function hideGameHud() {
  gameHud.classList.add("hidden");
  gameHud.setAttribute("aria-hidden", "true");
}

function updateGameHud() {
  hudBonesEl.textContent = formatNum(bones);
  hudHpEl.textContent = String(hp);
  hudMaxHpEl.textContent = String(maxHp);
}

function cheatHP() {
  devForceHp = 1000;
  maxHp = 1000;
  hp = 1000;
  invincibleUntil = 0;
  if (isPlaying()) {
    updateGameHud();
  }
}

function resetFullGame() {
  if (
    !confirm(
      "Полностью сбросить игру?\n\nБудут удалены все кости, рекорды и купленные корабли. Останется только стартовый шлюп."
    )
  ) {
    return;
  }

  localStorage.clear();
  location.reload();
}

function skipToSecondSea() {
  if (currentSea === 2 && isPlaying()) return;

  ensurePlayingForDevSkip();

  boneGalleonSpawned = true;
  enterSecondSea();
  updateGameHud();
  requestAnimationFrame(() => focusGame());
}

function ensurePlayingForDevSkip() {
  if (isPlaying()) return;

  menuMusicUnlocked = true;
  stopMenuMusic();
  resetRun();
  initWaterTiles();
  gameStartTime = performance.now();
  const ship = getCurrentShip();
  if (ship.hasShield) {
    isShielded = true;
    shieldReadyAt = 0;
  }
  hideAllMenus();
  hideGameOver();
  hideVictory();
  setGameState(GameState.PLAYING);
  showGameHud();
}

function skipToKrakenBoss() {
  ensurePlayingForDevSkip();

  if (currentSea !== 2) {
    boneGalleonSpawned = true;
    enterSecondSea();
  }

  if (kraken.active) {
    resetKraken();
  }

  endKrakenWhirlpools();
  endKrakenLaser();
  endKrakenGrab();
  turtleKillCount = 0;
  sea2TurtlesSpawned = SEA2_TURTLES_FOR_KRAKEN;
  sea2BonesBaseline = bones;

  beginKrakenBossFight();
  const now = performance.now();
  kraken.phase = "fight";
  kraken.introUntil = now;
  kraken.nextAttackAt = now + 1500;

  updateGameHud();
  requestAnimationFrame(() => focusGame());
}

window.cheatHP = cheatHP;
window.giveHP = cheatHP;
window.skipToSecondSea = skipToSecondSea;
window.skipToKrakenBoss = skipToKrakenBoss;

function setOverlayVisible(el, visible) {
  el.classList.toggle("hidden", !visible);
  el.setAttribute("aria-hidden", visible ? "false" : "true");
}

function hideAllMenus() {
  MENU_SCREENS.forEach((el) => setOverlayVisible(el, false));
}

function showMenuScreen(screen) {
  hideAllMenus();
  setOverlayVisible(screen, true);
  updateMenuDisplays();
}

function showMainMenu() {
  setGameState(GameState.MENU);
  clearKeys();
  hideGameHud();
  showMenuScreen(mainMenu);
  if (menuMusicUnlocked) {
    tryStartMenuMusic();
  }
}

function showShopMenu() {
  renderShop();
  showMenuScreen(shopMenu);
}

function showRecordsMenu() {
  showMenuScreen(recordsMenu);
}

function showDeveloperMenu() {
  showMenuScreen(developerMenu);
}

function setDevQuickAccessVisible(visible) {
  devQuickAccessVisible = visible;
  const skipSea2Btn = document.getElementById("skip-sea2-btn");
  const skipKrakenBtn = document.getElementById("skip-kraken-btn");
  const quickAccessBtn = document.getElementById("devQuickAccessBtn");

  if (skipSea2Btn) skipSea2Btn.classList.toggle("hidden", !visible);
  if (skipKrakenBtn) skipKrakenBtn.classList.toggle("hidden", !visible);
  if (quickAccessBtn) {
    quickAccessBtn.textContent = visible ? "Скрыть быстрый доступ" : "Быстрый доступ";
  }
}

function toggleDevQuickAccess() {
  setDevQuickAccessVisible(!devQuickAccessVisible);
}

const authorsOverlay = document.getElementById("authorsOverlay");

function showAuthorsOverlay() {
  if (!authorsOverlay) return;
  authorsOverlay.classList.remove("hidden");
  authorsOverlay.setAttribute("aria-hidden", "false");
}

function hideAuthorsOverlay() {
  if (!authorsOverlay) return;
  authorsOverlay.classList.add("hidden");
  authorsOverlay.setAttribute("aria-hidden", "true");
}

function showSecretMenu() {
  showMenuScreen(secretMenu);
}

function getWeaponLabel(ship) {
  switch (ship.weaponType) {
    case "double":
      return "Двойной выстрел";
    case "spread":
      return "Веер (3 ядра)";
    case "fast":
      return "Быстрый огонь + щит";
    default:
      return "Одиночный выстрел";
  }
}

function renderShop() {
  shopList.innerHTML = "";

  SHIP_TYPES.forEach((ship) => {
    const owned = progress.ownedShips.includes(ship.id);
    const selected = progress.selectedShipId === ship.id;
    const canBuy = !owned && progress.totalBones >= ship.price;

    const card = document.createElement("article");
    card.className = "ship-card" + (selected ? " ship-card--selected" : "");

    const priceText =
      ship.price === 0 ? "Бесплатно" : `${formatNum(ship.price)} костей`;

    let actionHtml = "";
    if (selected) {
      actionHtml = '<button type="button" class="menu-btn" disabled>Выбран</button>';
    } else if (owned) {
      actionHtml = `<button type="button" class="menu-btn" data-action="select" data-ship-id="${ship.id}">Выбрать</button>`;
    } else if (canBuy) {
      actionHtml = `<button type="button" class="menu-btn" data-action="buy" data-ship-id="${ship.id}">Купить</button>`;
    } else {
      actionHtml = '<button type="button" class="menu-btn" disabled>Купить</button>';
    }

    card.innerHTML = `
      <h3 class="ship-card__name">${ship.name}</h3>
      <p class="ship-card__stats">HP: ${ship.hp} · Скорость: ${ship.speed} · ${getWeaponLabel(ship)}</p>
      <p class="ship-card__price">${priceText}</p>
      <div class="ship-card__action">${actionHtml}</div>
    `;

    shopList.appendChild(card);
  });
}

function buyShip(shipId) {
  const ship = getShip(shipId);
  if (progress.ownedShips.includes(shipId)) return;
  if (progress.totalBones < ship.price) return;

  progress.totalBones -= ship.price;
  progress.ownedShips.push(shipId);
  saveProgress();
  renderShop();
  updateMenuDisplays();
}

function selectShip(shipId) {
  if (!progress.ownedShips.includes(shipId)) return;
  progress.selectedShipId = shipId;
  saveProgress();
  applySelectedShip();
  renderShop();
}

function isLeftKey(e) {
  return (
    e.code === "ArrowLeft" ||
    e.code === "KeyA" ||
    e.code === "KeyF" ||
    e.key === "a" ||
    e.key === "A" ||
    e.key === "ф" ||
    e.key === "Ф" ||
    e.key === "а" ||
    e.key === "А"
  );
}

function isRightKey(e) {
  return (
    e.code === "ArrowRight" ||
    e.code === "KeyD" ||
    e.key === "d" ||
    e.key === "D" ||
    e.key === "в" ||
    e.key === "В"
  );
}

function isUpKey(e) {
  return (
    e.code === "ArrowUp" ||
    e.code === "KeyW" ||
    e.key === "w" ||
    e.key === "W" ||
    e.key === "ц" ||
    e.key === "Ц"
  );
}

function isDownKey(e) {
  return (
    e.code === "ArrowDown" ||
    e.code === "KeyS" ||
    e.key === "s" ||
    e.key === "S" ||
    e.key === "ы" ||
    e.key === "Ы"
  );
}

function getQteKeyFromEvent(e) {
  if (isUpKey(e)) return "w";
  if (isLeftKey(e)) return "a";
  if (isDownKey(e)) return "s";
  if (isRightKey(e)) return "d";
  return null;
}

function getQteKeyLabel(key) {
  return { w: "W", a: "A", s: "S", d: "D" }[key] || key.toUpperCase();
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function isKrakenBossActive() {
  return kraken.active && kraken.phase !== null;
}

function isKrakenFightPhase() {
  return kraken.active && kraken.phase === "fight";
}

function scheduleKrakenNextAttack() {
  kraken.nextAttackAt =
    performance.now() +
    KRAKEN_GRAB_MIN_MS +
    Math.random() * (KRAKEN_GRAB_MAX_MS - KRAKEN_GRAB_MIN_MS);
}

function isKrakenWhirlpoolPhase() {
  return kraken.active && kraken.phase === "whirlpool";
}

function isKrakenLaserPhase() {
  return kraken.active && kraken.phase === "laser";
}

function pickKrakenAttackType() {
  const roll = Math.random();
  if (roll < 0.34) return "grab";
  if (roll < 0.67) return "whirlpool";
  return "laser";
}

function endKrakenLaser() {
  isLaserCharging = false;
  isLaserFiring = false;
  laserTimer = 0;
  laserDamageTimer = 0;
  if (kraken.phase === "laser") {
    kraken.phase = "fight";
  }
  if (isKrakenFightPhase() && !kraken.isDead && !kraken.sinking) {
    scheduleKrakenNextAttack();
  }
}

function resetKraken() {
  kraken = createKrakenState();
  isLowHpPlayed = false;
  tentacleFadeUntil = 0;
  whirlpools = [];
  whirlpoolDamageTimer = 0;
  endKrakenLaser();
  endKrakenGrab();
}

function beginKrakenBossFight() {
  if (currentSea !== 2) return;

  const now = performance.now();
  kraken.active = true;
  kraken.phase = "intro";
  kraken.isDead = false;
  kraken.sinking = false;
  kraken.hp = KRAKEN_MAX_HP;
  kraken.maxHp = KRAKEN_MAX_HP;
  kraken.w = KRAKEN_DRAW_W;
  kraken.h = KRAKEN_DRAW_H;
  kraken.x = W / 2 - kraken.w / 2;
  kraken.y = KRAKEN_POS_Y;
  kraken.introUntil = now + KRAKEN_INTRO_MS;
  kraken.nextAttackAt = now + KRAKEN_FIRST_GRAB_DELAY_MS;
  whirlpools = [];
  whirlpoolDamageTimer = 0;
  turtleEnemies = [];
  enemies = [];
  obstacles = [];
  barrels = [];
  bullets = [];
  enemyBullets = [];
  endKrakenGrab();
  isLowHpPlayed = false;
  playKrakenSfx(krakenSpawnSound);
  startKrakenBossMusic();
}

function damageKraken(amount) {
  if (!kraken.active || kraken.isDead || kraken.sinking) return;

  kraken.hp -= amount;
  if (kraken.hp <= 0) {
    kraken.hp = 0;
    kraken.isDead = true;
    kraken.sinking = true;
    kraken.phase = "sink";
    endKrakenWhirlpools();
    endKrakenLaser();
    endKrakenGrab();
    bones += KRAKEN_BONES_REWARD;
    playKrakenSfx(krakenDeathSound);
  }
}

function startKrakenGrab() {
  if (currentSea !== 2 || !isPlaying() || isGrabbed) return;
  if (!isKrakenFightPhase() || kraken.isDead || kraken.sinking) return;

  isGrabbed = true;
  tentacleFadeUntil = 0;
  currentQteIndex = 0;
  krakenQteErrorUntil = 0;
  krakenSqueezeTimer = 0;
  requiredKeys = shuffleArray([...KRAKEN_QTE_KEY_POOL]).slice(0, KRAKEN_QTE_LENGTH);
  playKrakenAttackSound();
  clearKeys();
}

function endKrakenGrab(qteSuccess = false) {
  if (isGrabbed) {
    tentacleFadeUntil = performance.now() + TENTACLE_FADE_MS;
  }
  isGrabbed = false;
  requiredKeys = [];
  currentQteIndex = 0;
  krakenQteErrorUntil = 0;
  krakenSqueezeTimer = 0;
  clearKeys();

  if (isKrakenFightPhase() && !kraken.isDead && !kraken.sinking) {
    if (qteSuccess) {
      damageKraken(KRAKEN_QTE_SUCCESS_DAMAGE);
    }
    scheduleKrakenNextAttack();
  }
}

function getWhirlpoolSafeCorridor() {
  const corridorW = W * WHIRLPOOL_SAFE_CORRIDOR_RATIO;
  const margin = (W - corridorW) / 2;
  return { minX: margin, maxX: W - margin };
}

function createWhirlpool(x, y, arm, vx, vy) {
  return {
    x,
    y,
    w: WHIRLPOOL_W,
    h: WHIRLPOOL_H,
    arm,
    vx,
    vy,
    spinPhase: Math.random() * Math.PI * 2,
  };
}

function buildWhirlpoolG() {
  const pools = [];
  const corridor = getWhirlpoolSafeCorridor();

  for (let i = 0; i < WHIRLPOOLS_PER_ARM; i++) {
    const t = WHIRLPOOLS_PER_ARM === 1 ? 0.5 : i / (WHIRLPOOLS_PER_ARM - 1);
    const y = Math.round(H * (0.18 + t * 0.62) - WHIRLPOOL_H / 2);
    pools.push(
      createWhirlpool(
        -WHIRLPOOL_W * 0.4,
        y,
        "vertical",
        WHIRLPOOL_INWARD_SPEED,
        0
      )
    );
  }

  for (let i = 0; i < WHIRLPOOLS_PER_ARM; i++) {
    const t = WHIRLPOOLS_PER_ARM === 1 ? 0.5 : i / (WHIRLPOOLS_PER_ARM - 1);
    const x = Math.round(W * 0.04 + t * (corridor.minX + WHIRLPOOL_W * 0.35) - WHIRLPOOL_W / 2);
    pools.push(
      createWhirlpool(
        x,
        -WHIRLPOOL_H * 0.35,
        "horizontal",
        0,
        WHIRLPOOL_DOWN_SPEED
      )
    );
  }

  return pools;
}

function startKrakenWhirlpools() {
  if (currentSea !== 2 || !isPlaying()) return;
  if (!isKrakenFightPhase() || kraken.isDead || kraken.sinking || isGrabbed) return;

  const now = performance.now();
  kraken.phase = "whirlpool";
  kraken.whirlpoolEndsAt = now + KRAKEN_WHIRLPOOL_DURATION_MS;
  whirlpoolDamageTimer = 0;

  whirlpools = buildWhirlpoolG();
  playKrakenAttackSound();
}

function endKrakenWhirlpools() {
  whirlpools = [];
  whirlpoolDamageTimer = 0;
  if (kraken.phase === "whirlpool") {
    kraken.phase = "fight";
  }
  if (isKrakenFightPhase() && !kraken.isDead && !kraken.sinking) {
    scheduleKrakenNextAttack();
  }
}

function updateKrakenWhirlpools(dt, now) {
  if (!isKrakenWhirlpoolPhase()) return;

  if (now >= kraken.whirlpoolEndsAt) {
    endKrakenWhirlpools();
    return;
  }

  const corridor = getWhirlpoolSafeCorridor();
  const playerCenterY = player.y + player.height / 2;

  const topArmMaxY = Math.round(H * WHIRLPOOL_G_TOP_MAX_Y_RATIO) - WHIRLPOOL_H;
  const playerCenterX = player.x + player.width / 2;

  for (const pool of whirlpools) {
    if (pool.arm === "horizontal") {
      pool.y += pool.vy * dt;

      const poolCenterX = pool.x + pool.w / 2;
      const dx = playerCenterX - poolCenterX;
      const xStep = WHIRLPOOL_TRACK_SPEED * dt;
      if (Math.abs(dx) <= xStep) {
        pool.x += dx;
      } else {
        pool.x += Math.sign(dx) * xStep;
      }

      pool.x = Math.max(0, Math.min(pool.x, W - pool.w));
      pool.y = Math.max(-WHIRLPOOL_H, Math.min(pool.y, topArmMaxY));
      continue;
    }

    pool.x += pool.vx * dt;

    const poolCenterY = pool.y + pool.h / 2;
    const dy = playerCenterY - poolCenterY;
    const yStep = WHIRLPOOL_TRACK_SPEED * dt;
    if (Math.abs(dy) <= yStep) {
      pool.y += dy;
    } else {
      pool.y += Math.sign(dy) * yStep;
    }

    pool.y = Math.max(6, Math.min(pool.y, H - pool.h - 6));

    const maxX = corridor.minX - pool.w;
    if (pool.x > maxX) pool.x = maxX;
  }

  const playerRect = getPlayerRect();
  let touching = false;

  for (const pool of whirlpools) {
    if (rectsOverlap(playerRect, pool)) {
      touching = true;
      break;
    }
  }

  if (!touching) return;

  whirlpoolDamageTimer += dt;
  if (whirlpoolDamageTimer >= KRAKEN_WHIRLPOOL_DAMAGE_INTERVAL_S) {
    whirlpoolDamageTimer = 0;
    takeDamage(KRAKEN_WHIRLPOOL_DAMAGE);
  }
}

function getKrakenLaserHitbox() {
  const w = Math.round(W * KRAKEN_LASER_HITBOX_W_RATIO);
  const h = H - 16;
  return {
    x: Math.round((W - w) / 2),
    y: 8,
    w,
    h,
  };
}

function startKrakenLaser() {
  if (currentSea !== 2 || !isPlaying()) return;
  if (!isKrakenFightPhase() || kraken.isDead || kraken.sinking || isGrabbed) return;

  const now = performance.now();
  kraken.phase = "laser";
  isLaserCharging = true;
  isLaserFiring = false;
  laserTimer = now;
  laserDamageTimer = 0;
  kraken.laserChargeEndsAt = now + KRAKEN_LASER_CHARGE_MS;
  kraken.laserEndsAt = now + KRAKEN_LASER_CHARGE_MS + KRAKEN_LASER_FIRE_MS;
  playKrakenAttackSound();
}

function updateKrakenLaser(dt, now) {
  if (!isKrakenLaserPhase()) return;

  if (isLaserCharging && now >= kraken.laserChargeEndsAt) {
    isLaserCharging = false;
    isLaserFiring = true;
    laserTimer = now;
  }

  if (isLaserFiring) {
    const laserRect = getKrakenLaserHitbox();
    if (rectsOverlap(getPlayerRect(), laserRect)) {
      laserDamageTimer += dt;
      if (laserDamageTimer >= KRAKEN_LASER_DAMAGE_INTERVAL_S) {
        laserDamageTimer = 0;
        takeDamage(KRAKEN_LASER_DAMAGE);
      }
    } else {
      laserDamageTimer = 0;
    }
  }

  if (now >= kraken.laserEndsAt) {
    endKrakenLaser();
  }
}

function triggerKrakenAttack() {
  const attackType = pickKrakenAttackType();
  if (attackType === "whirlpool") {
    startKrakenWhirlpools();
  } else if (attackType === "laser") {
    startKrakenLaser();
  } else {
    startKrakenGrab();
  }
}

function handleKrakenQteKey(e) {
  const key = getQteKeyFromEvent(e);
  if (!key) return;

  e.preventDefault();

  if (key === requiredKeys[currentQteIndex]) {
    currentQteIndex += 1;
    if (currentQteIndex >= requiredKeys.length) {
      endKrakenGrab(true);
    }
    return;
  }

  krakenQteErrorUntil = performance.now() + 450;
  takeDamage(KRAKEN_QTE_WRONG_DAMAGE);
}

function updateKrakenGrab(dt) {
  if (!isGrabbed) return;

  player.y += KRAKEN_GRAB_SINK_SPEED * dt;

  krakenSqueezeTimer += dt;
  if (krakenSqueezeTimer < KRAKEN_SQUEEZE_GRACE_S) return;

  const squeezeElapsed = krakenSqueezeTimer - KRAKEN_SQUEEZE_GRACE_S;
  if (squeezeElapsed >= KRAKEN_SQUEEZE_INTERVAL_S) {
    krakenSqueezeTimer = KRAKEN_SQUEEZE_GRACE_S;
    takeDamage(KRAKEN_GRAB_SQUEEZE_DAMAGE);
  }
}

function updateKrakenBoss(dt) {
  if (!kraken.active) return;

  if (!kraken.isDead && !kraken.sinking && kraken.hp <= 50 && !isLowHpPlayed) {
    isLowHpPlayed = true;
    playKrakenSfx(krakenLowHpSound);
  }

  const now = performance.now();

  if (kraken.phase === "intro" && now >= kraken.introUntil) {
    kraken.phase = "fight";
  }

  if (kraken.sinking) {
    kraken.y += KRAKEN_SINK_SPEED * dt;
    if (kraken.y > H + kraken.h) {
      finishKrakenBoss();
    }
    return;
  }

  if (isKrakenWhirlpoolPhase()) {
    updateKrakenWhirlpools(dt, now);
    return;
  }

  if (isKrakenLaserPhase()) {
    updateKrakenLaser(dt, now);
    return;
  }

  if (!isKrakenFightPhase() || isGrabbed || kraken.isDead) return;

  if (now >= kraken.nextAttackAt) {
    triggerKrakenAttack();
  }
}

function finishKrakenBoss() {
  stopKrakenBossMusic();
  resetKraken();
  turtleKillCount = 0;
  resumeSea2MusicAfterKraken();
  showVictory();
}

function getKrakenRect() {
  return { x: kraken.x, y: kraken.y, w: kraken.w, h: kraken.h };
}

function getKrakenHitbox() {
  return {
    x: kraken.x - KRAKEN_HITBOX_PAD,
    y: kraken.y - KRAKEN_HITBOX_PAD,
    w: kraken.w + KRAKEN_HITBOX_PAD * 2,
    h: kraken.h + KRAKEN_HITBOX_PAD * 2,
  };
}

function bulletHitsKraken(bullet) {
  if (!kraken.active || kraken.isDead || kraken.sinking) return false;
  if (!circleRectOverlap(bullet.x, bullet.y, getBulletRadius(bullet), getKrakenHitbox())) {
    return false;
  }

  damageKraken(KRAKEN_BULLET_DAMAGE);
  return true;
}

function getSea2BonesEarned() {
  if (currentSea !== 2) return 0;
  return Math.max(0, bones - sea2BonesBaseline);
}

function trySpawnSea2Turtle() {
  if (currentSea !== 2 || isKrakenBossActive()) return;
  if (sea2TurtlesSpawned >= SEA2_TURTLES_FOR_KRAKEN) return;
  if (turtleEnemies.length >= MAX_TURTLES_ON_FIELD) return;

  const spawnAtBones =
    sea2BonesBaseline + (sea2TurtlesSpawned + 1) * SEA2_TURTLE_SPAWN_BONES;
  if (bones < spawnAtBones) return;

  if (spawnTurtle()) {
    sea2TurtlesSpawned += 1;
  }
}

function onTurtleDestroyed() {
  if (currentSea !== 2 || isKrakenBossActive()) return;

  turtleKillCount += 1;
  if (
    turtleKillCount >= SEA2_TURTLES_FOR_KRAKEN &&
    getSea2BonesEarned() >= SEA2_BONES_FOR_KRAKEN
  ) {
    turtleKillCount = 0;
    beginKrakenBossFight();
  }
}

function handleKeyDown(e) {
  if (!isPlaying()) return;

  if (isGrabbed) {
    handleKrakenQteKey(e);
    return;
  }

  if (isLeftKey(e)) {
    keys.left = true;
    e.preventDefault();
  }
  if (isRightKey(e)) {
    keys.right = true;
    e.preventDefault();
  }
  if (isUpKey(e)) {
    keys.up = true;
    e.preventDefault();
  }
  if (isDownKey(e)) {
    keys.down = true;
    e.preventDefault();
  }
  if (e.code === "Space") {
    fireBullet();
    e.preventDefault();
  }
}

function handleKeyUp(e) {
  if (!isPlaying()) return;

  if (isLeftKey(e)) keys.left = false;
  if (isRightKey(e)) keys.right = false;
  if (isUpKey(e)) keys.up = false;
  if (isDownKey(e)) keys.down = false;
}

window.addEventListener("keydown", handleKeyDown, true);
window.addEventListener("keyup", handleKeyUp, true);
window.addEventListener("blur", clearKeys);

function randomSpeed(range) {
  return range.min + Math.random() * (range.max - range.min);
}

function hasSniperOnField() {
  return enemies.some((e) => e.kind === ENEMY_KIND.SNIPER);
}

function hasKamikazeOnField() {
  return enemies.some((e) => e.kind === ENEMY_KIND.KAMIKAZE);
}

function pickEnemyKindRoll() {
  const roll = Math.random();
  if (roll < 0.6) return ENEMY_KIND.SCOUT;
  if (roll < 0.85) return ENEMY_KIND.KAMIKAZE;
  return ENEMY_KIND.SNIPER;
}

function pickEnemyKindFallback() {
  const options = [ENEMY_KIND.SCOUT];
  if (!hasKamikazeOnField()) options.push(ENEMY_KIND.KAMIKAZE);
  if (!hasSniperOnField()) options.push(ENEMY_KIND.SNIPER);
  return options[Math.floor(Math.random() * options.length)];
}

function pickEnemyKind() {
  for (let attempt = 0; attempt < 8; attempt++) {
    const kind = pickEnemyKindRoll();
    if (kind === ENEMY_KIND.SNIPER && hasSniperOnField()) continue;
    if (kind === ENEMY_KIND.KAMIKAZE && hasKamikazeOnField()) continue;
    return kind;
  }
  return pickEnemyKindFallback();
}

function normalizeSpawnKind(kind) {
  if (kind === ENEMY_KIND.SNIPER && hasSniperOnField()) {
    return pickEnemyKindFallback();
  }
  if (kind === ENEMY_KIND.KAMIKAZE && hasKamikazeOnField()) {
    return pickEnemyKindFallback();
  }
  return kind;
}

function getActiveBoss() {
  return enemies.find((e) => e.kind === ENEMY_KIND.BOSS && e.hp > 0) || null;
}

function getBulletRadius(bullet) {
  return bullet.radius ?? Math.max(bullet.w, bullet.h) * 0.42;
}

function spawnEnemyBullet(x, y, vx, vy, playSound = true) {
  enemyBullets.push({
    type: BULLET_TYPE.ENEMY,
    x,
    y,
    w: ENEMY_BULLET_W,
    h: ENEMY_BULLET_H,
    radius: ENEMY_BULLET_W / 2,
    vx,
    vy,
  });
  if (playSound) {
    playClonedSound(sounds.enemyShootSound);
  }
}

function createEnemy(kind, x, y, overrides = {}) {
  const def = ENEMY_DEF[kind];
  const enemy = {
    kind,
    x,
    y,
    w: def.w,
    h: def.h,
    speed: def.speed,
    phase: Math.random() * Math.PI * 2,
    ...overrides,
  };

  if (kind === ENEMY_KIND.SCOUT) {
    enemy.nextShotAt = performance.now() + SCOUT_SHOT_MIN_MS + Math.random() * (SCOUT_SHOT_MAX_MS - SCOUT_SHOT_MIN_MS);
  }

  if (kind === ENEMY_KIND.SNIPER) {
    enemy.anchorY =
      H * (SNIPER_ANCHOR_Y_MIN + Math.random() * (SNIPER_ANCHOR_Y_MAX - SNIPER_ANCHOR_Y_MIN));
    enemy.anchored = false;
    enemy.nextShotAt = 0;
    enemy.shotsInBurst = 0;
  }

  if (kind === ENEMY_KIND.BOSS) {
    enemy.hp = def.hp;
    enemy.maxHp = def.hp;
    enemy.attackPhase = 0;
    enemy.nextAttackAt = performance.now() + 1500;
    enemy.nextSummonAt = performance.now() + BOSS_SUMMON_INTERVAL_MS;
    enemy.targetY = 28;
  }

  return enemy;
}

function getSpawnCenterX(entity) {
  return entity.x + entity.w / 2;
}

function collectSpawnBlockers() {
  const blockers = [];

  enemies.forEach((enemy) => {
    if (enemy.kind === ENEMY_KIND.BOSS) return;
    blockers.push(enemy);
  });

  obstacles.forEach((obs) => blockers.push(obs));
  barrels.forEach((barrel) => blockers.push(barrel));
  turtleEnemies.forEach((turtle) => blockers.push(turtle));
  boosters.forEach((booster) => blockers.push(booster));
  return blockers;
}

function isSpawnXFree(x, w, blockers, minCenterGap) {
  const center = x + w / 2;

  for (const blocker of blockers) {
    if (Math.abs(center - getSpawnCenterX(blocker)) < minCenterGap) {
      return false;
    }
  }

  return true;
}

function shuffleLaneOrder() {
  const lanes = Array.from({ length: SPAWN_LANE_COUNT }, (_, i) => i);
  for (let i = lanes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lanes[i], lanes[j]] = [lanes[j], lanes[i]];
  }
  return lanes;
}

function pickSpawnX(w, options = {}) {
  const { kamikazeClear = false, preferredCenterX = null, minGap = null } = options;
  const gap = minGap ?? (kamikazeClear ? SPAWN_X_KAMIKAZE_GAP : SPAWN_X_MIN_GAP);
  const blockers = collectSpawnBlockers();
  const laneW = W / SPAWN_LANE_COUNT;

  if (preferredCenterX !== null) {
    const preferredX = Math.max(0, Math.min(preferredCenterX - w / 2, W - w));
    if (isSpawnXFree(preferredX, w, blockers, gap)) {
      return preferredX;
    }
  }

  for (const lane of shuffleLaneOrder()) {
    const laneCenter = lane * laneW + laneW / 2;
    const laneX = Math.max(0, Math.min(laneCenter - w / 2, W - w));
    if (isSpawnXFree(laneX, w, blockers, gap)) {
      return laneX;
    }
  }

  for (let attempt = 0; attempt < SPAWN_X_MAX_ATTEMPTS; attempt++) {
    const randomX = Math.random() * (W - w);
    if (isSpawnXFree(randomX, w, blockers, gap)) {
      return randomX;
    }
  }

  return null;
}

function getLineEnemies() {
  return enemies.filter((e) => e.kind !== ENEMY_KIND.BOSS);
}

function isEnemyInLane(enemy, lane, laneW) {
  const laneCenter = lane * laneW + laneW / 2;
  const center = enemy.x + enemy.w / 2;
  return Math.abs(center - laneCenter) < laneW * 0.55;
}

function pickConveyorLane(kind) {
  const laneW = W / SPAWN_LANE_COUNT;
  const line = getLineEnemies();
  let bestLane = 0;
  let bestGap = -Infinity;

  for (let lane = 0; lane < SPAWN_LANE_COUNT; lane++) {
    if (kind === ENEMY_KIND.KAMIKAZE) {
      const laneCenter = lane * laneW + laneW / 2;
      const kamikazeBlocked = line.some(
        (e) =>
          e.kind === ENEMY_KIND.KAMIKAZE &&
          Math.abs(e.x + e.w / 2 - laneCenter) < SPAWN_X_KAMIKAZE_GAP
      );
      if (kamikazeBlocked) continue;
    }

    const inLane = line.filter((e) => isEnemyInLane(e, lane, laneW));
    const gap = inLane.length > 0 ? Math.min(...inLane.map((e) => e.y)) : H + 100;

    if (gap > bestGap) {
      bestGap = gap;
      bestLane = lane;
    }
  }

  return bestLane;
}

function spawnEnemyConveyor(kind = pickEnemyKind()) {
  kind = normalizeSpawnKind(kind);
  if (kind === ENEMY_KIND.BOSS) return false;
  if (getLineEnemies().length >= MAX_ENEMIES_ON_FIELD) return false;

  const def = ENEMY_DEF[kind];
  const laneW = W / SPAWN_LANE_COUNT;
  const lane = pickConveyorLane(kind);
  const x = Math.max(0, Math.min(lane * laneW + laneW / 2 - def.w / 2, W - def.w));

  const inLane = getLineEnemies().filter((e) => isEnemyInLane(e, lane, laneW));
  let spawnY = -def.h;

  if (inLane.length > 0) {
    const topY = Math.min(...inLane.map((e) => e.y));
    spawnY = topY - def.h - ENEMY_CONVEYOR_GAP;
  }

  enemies.push(createEnemy(kind, x, spawnY));
  return true;
}

function spawnEnemy(kind = pickEnemyKind()) {
  return spawnEnemyConveyor(kind);
}

function updateEnemyConveyor(now) {
  if (!isPlaying() || currentSea < 1) return;
  if (isKrakenBossActive()) return;
  if (currentSea === 1 && getActiveBoss()) return;

  let line = getLineEnemies();
  let fillAttempts = 0;

  while (line.length < MIN_ENEMIES_ON_SCREEN && fillAttempts < 12) {
    fillAttempts += 1;
    if (!spawnEnemyConveyor()) break;
    line = getLineEnemies();
  }

  if (
    now - lastEnemySpawnTime >= ENEMY_SPAWN_INTERVAL_MS &&
    line.length < MAX_ENEMIES_ON_FIELD
  ) {
    if (spawnEnemyConveyor()) {
      lastEnemySpawnTime = now;
    }
  }
}

function seedEnemyConvoy() {
  const lineup = [
    ENEMY_KIND.SCOUT,
    ENEMY_KIND.KAMIKAZE,
    ENEMY_KIND.SNIPER,
  ];

  lineup.forEach((kind, index) => {
    if (!spawnEnemyConveyor(kind)) return;
    const spawned = enemies[enemies.length - 1];
    if (spawned) {
      spawned.y = -spawned.h - index * (ENEMY_LINE_H + ENEMY_CONVEYOR_GAP);
    }
  });

  lastEnemySpawnTime = performance.now();
}

function spawnKamikazeAt(preferredCenterX, y) {
  if (hasKamikazeOnField()) return;

  const def = ENEMY_DEF[ENEMY_KIND.KAMIKAZE];
  const x = pickSpawnX(def.w, {
    kamikazeClear: true,
    preferredCenterX,
  });
  if (x === null) return;

  enemies.push(createEnemy(ENEMY_KIND.KAMIKAZE, x, y));
}

function spawnBossKamikaze(boss) {
  spawnKamikazeAt(boss.x + boss.w / 2, boss.y + boss.h);
}

function beginBossFight() {
  enemies = enemies.filter((e) => e.kind === ENEMY_KIND.BOSS);
  obstacles = [];
  barrels = [];
  enemyBullets = [];
  bullets = [];
  explosionEffects = [];
}

function spawnBoss() {
  if (getActiveBoss()) return;

  beginBossFight();

  const def = ENEMY_DEF[ENEMY_KIND.BOSS];
  const x = W / 2 - def.w / 2;
  const boss = createEnemy(ENEMY_KIND.BOSS, x, -def.h);
  boss.spawnInvulnUntil = performance.now() + 2200;
  enemies.push(boss);
}

function trySpawnBoss() {
  if (currentSea !== 1) return;
  if (boneGalleonSpawned || getActiveBoss()) return;
  if (bones < BOSS_FIRST_AT_BONES) return;

  spawnBoss();
  boneGalleonSpawned = true;
}

function destroyEnemy(enemy, reward) {
  if (enemy.kind !== ENEMY_KIND.BOSS) {
    playEnemyExplosionSound();
  } else {
    playClonedSound(sounds.explosionSound);
  }
  bones += reward;
  trySpawnBoosterOnKill(enemy);
}

function setCanvasSeaBackground() {
  canvas.style.background = currentSea === 2 ? SEA_2_COLOR : SEA_COLOR;
}

function resetSea2WaterState() {
  hasMonsterAppeared = false;
  sea2MonsterRow = null;
  waterOffsetY = 0;
  sea2TileW = 0;
  sea2TileH = 0;
  sea2CropTemplate = null;
  sea2MonsterAllowedAfter =
    performance.now() +
    SEA2_MONSTER_MIN_DELAY_MS +
    Math.random() * (SEA2_MONSTER_MAX_DELAY_MS - SEA2_MONSTER_MIN_DELAY_MS);
  setCanvasSeaBackground();
}

function enterSecondSea() {
  currentSea = 2;
  obstacles = [];
  barrels = [];
  enemies = [];
  turtleEnemies = [];
  enemyBullets = [];
  boosters = [];
  bullets = [];
  explosionEffects = [];
  const now = performance.now();
  nextGuaranteedBarrelAt = 0;
  sea2BonesBaseline = bones;
  sea2TurtlesSpawned = 0;
  lastEnemySpawnTime = now;
  lastObstacleSpawnTime = now;
  lastBarrelSpawnTime = now;
  seaTransitionTextUntil = now + SEA_TRANSITION_MS;
  resetSea2WaterState();
  turtleKillCount = 0;
  resetKraken();
  seedEnemyConvoy();
  scheduleNextGuaranteedBarrel(FIRST_BARREL_DELAY_MS);
  stopSea2Music();
  playSea2Music();
}

function createTurtle(x) {
  return {
    x,
    y: -TURTLE_H,
    w: TURTLE_W,
    h: TURTLE_H,
    hp: TURTLE_HP,
    maxHp: TURTLE_HP,
    speed: TURTLE_SPEED,
  };
}

function spawnTurtle() {
  if (currentSea !== 2) return false;
  if (turtleEnemies.length >= MAX_TURTLES_ON_FIELD) return false;

  let x = pickSpawnX(TURTLE_W, { minGap: 96 });
  if (x === null) {
    const laneW = W / SPAWN_LANE_COUNT;
    const lane = Math.floor(Math.random() * SPAWN_LANE_COUNT);
    x = Math.max(0, Math.min(lane * laneW + laneW / 2 - TURTLE_W / 2, W - TURTLE_W));
  }

  turtleEnemies.push(createTurtle(x));
  return true;
}

function destroyTurtleAt(index) {
  turtleEnemies.splice(index, 1);
  bones += TURTLE_BONES_REWARD;
  playClonedSound(sounds.explosionSound);
  onTurtleDestroyed();
}

function bulletHitsTurtle(bullet) {
  if (currentSea !== 2) return false;

  for (let i = turtleEnemies.length - 1; i >= 0; i--) {
    const turtle = turtleEnemies[i];
    if (!circleRectOverlap(bullet.x, bullet.y, getBulletRadius(bullet), turtle)) continue;

    turtle.hp -= 1;
    if (turtle.hp <= 0) {
      destroyTurtleAt(i);
    }
    return true;
  }

  return false;
}

function onSea2SpawnTick() {
  if (isKrakenBossActive()) return;
  trySpawnSea2Turtle();
}

function onFirstBossDefeated() {
  if (currentSea !== 1) return;
  enterSecondSea();
}

function spawnBooster() {
  if (!isPlaying()) return;

  const w = BOOSTER_REPAIR_SIZE;
  const h = BOOSTER_REPAIR_SIZE;
  const x = pickSpawnX(w, {});
  if (x === null) return;

  boosters.push({
    kind: BOOSTER_KIND.REPAIR,
    x,
    y: -h,
    w,
    h,
    speed: BOOSTER_REPAIR_SPEED,
  });
}

function trySpawnBoosterOnKill(enemy) {
  if (enemy.kind !== ENEMY_KIND.SNIPER && enemy.kind !== ENEMY_KIND.KAMIKAZE) {
    return;
  }
  if (Math.random() >= BOOSTER_KILL_DROP_CHANCE) return;
  spawnBooster();
}

function pickupRepairBooster() {
  if (hp < maxHp) {
    hp = Math.min(hp + 1, maxHp);
    updateGameHud();
  }
}

function failFromKamikazeEscape() {
  if (!isPlaying()) return;
  hp = 0;
  showGameOver();
}

function updateScout(enemy, dt, now) {
  enemy.y += enemy.speed * dt;
  enemy.x += Math.sin(now * 0.004 + enemy.phase) * 36 * dt;

  if (enemy.x < 0) enemy.x = 0;
  if (enemy.x + enemy.w > W) enemy.x = W - enemy.w;

  if (now >= enemy.nextShotAt) {
    spawnEnemyBullet(
      enemy.x + enemy.w / 2,
      enemy.y + enemy.h,
      0,
      ENEMY_BULLET_SPEED
    );
    enemy.nextShotAt = now + SCOUT_SHOT_MIN_MS + Math.random() * (SCOUT_SHOT_MAX_MS - SCOUT_SHOT_MIN_MS);
  }
}

function updateKamikaze(enemy, dt) {
  enemy.y += enemy.speed * dt;
}

function updateSniper(enemy, dt, now) {
  if (!enemy.anchored) {
    enemy.y += enemy.speed * dt;
    if (enemy.y >= enemy.anchorY) {
      enemy.y = enemy.anchorY;
      enemy.anchored = true;
      enemy.shotsInBurst = 0;
      enemy.nextShotAt = now + SNIPER_FIRST_SHOT_DELAY_MS;
    }
    return;
  }

  if (now < enemy.nextShotAt) return;

  spawnEnemyBullet(enemy.x + enemy.w / 2, enemy.y + enemy.h, 0, SNIPER_BULLET_SPEED);
  enemy.shotsInBurst = (enemy.shotsInBurst || 0) + 1;

  if (enemy.shotsInBurst < SNIPER_BURST_SHOTS) {
    enemy.nextShotAt = now + SNIPER_BURST_GAP_MS;
  } else {
    enemy.shotsInBurst = 0;
    enemy.nextShotAt = now + SNIPER_BURST_COOLDOWN_MS;
  }
}

function bossFireSpread(enemy) {
  if (enemy.kind !== ENEMY_KIND.BOSS || !getActiveBoss()) return;

  playBoss1CannonSound();

  const cx = enemy.x + enemy.w / 2;
  const cy = enemy.y + enemy.h;
  const spread = 170;
  spawnEnemyBullet(cx, cy, -spread, ENEMY_BULLET_SPEED, false);
  spawnEnemyBullet(cx, cy, 0, ENEMY_BULLET_SPEED + 20, false);
  spawnEnemyBullet(cx, cy, spread, ENEMY_BULLET_SPEED, false);
}

function bossFireLine(enemy) {
  if (enemy.kind !== ENEMY_KIND.BOSS || !getActiveBoss()) return;

  playBoss1CannonSound();

  const cy = enemy.y + enemy.h;
  const cx = enemy.x + enemy.w / 2;
  for (let i = -2; i <= 2; i++) {
    spawnEnemyBullet(cx + i * 22, cy, 0, ENEMY_BULLET_SPEED, false);
  }
}

function updateBoss(enemy, dt, now) {
  if (enemy.y < enemy.targetY) {
    enemy.y += enemy.speed * dt;
  }

  if (now >= enemy.nextSummonAt) {
    spawnBossKamikaze(enemy);
    enemy.nextSummonAt = now + BOSS_SUMMON_INTERVAL_MS;
  }

  if (now >= enemy.nextAttackAt) {
    if (enemy.attackPhase === 0) {
      bossFireSpread(enemy);
    } else {
      bossFireLine(enemy);
    }
    enemy.attackPhase = enemy.attackPhase === 0 ? 1 : 0;
    enemy.nextAttackAt = now + BOSS_ATTACK_INTERVAL_MS;
  }
}

function updateEnemyEntity(enemy, dt, now) {
  switch (enemy.kind) {
    case ENEMY_KIND.SCOUT:
      updateScout(enemy, dt, now);
      break;
    case ENEMY_KIND.KAMIKAZE:
      updateKamikaze(enemy, dt);
      break;
    case ENEMY_KIND.SNIPER:
      updateSniper(enemy, dt, now);
      break;
    case ENEMY_KIND.BOSS:
      updateBoss(enemy, dt, now);
      break;
    default:
      enemy.y += enemy.speed * dt;
  }
}

function hitEnemyWithBullets(enemy) {
  if (enemy.kind === ENEMY_KIND.BOSS && performance.now() < (enemy.spawnInvulnUntil || 0)) {
    return false;
  }

  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    if (!circleRectOverlap(b.x, b.y, getBulletRadius(b), enemy)) continue;

    bullets.splice(i, 1);

    if (enemy.kind === ENEMY_KIND.BOSS) {
      enemy.hp -= 1;
      if (enemy.hp <= 0) {
        destroyEnemy(enemy, ENEMY_DEF[ENEMY_KIND.BOSS].bones);
        onFirstBossDefeated();
        return true;
      }
      return false;
    }

    destroyEnemy(enemy, ENEMY_DEF[enemy.kind].bones);
    return true;
  }
  return false;
}

function getCurrentShip() {
  return getShip(progress.selectedShipId);
}

function getFireCooldownMs() {
  const ship = getCurrentShip();
  return ship.weaponType === "fast" ? FIRE_COOLDOWN_FAST_MS : FIRE_COOLDOWN_MS;
}

function createPlayerBullet(x, y, vx = 0) {
  return {
    type: BULLET_TYPE.PLAYER,
    x,
    y,
    w: PLAYER_BULLET_W,
    h: PLAYER_BULLET_H,
    radius: PLAYER_BULLET_W / 2,
    vx,
    vy: -BULLET_SPEED,
  };
}

function fireBullet() {
  if (isGrabbed) return;

  const now = performance.now();
  if (now - lastFireTime < getFireCooldownMs()) return;
  lastFireTime = now;

  const ship = getCurrentShip();
  const centerY = player.y;

  switch (ship.weaponType) {
    case "double":
      bullets.push(createPlayerBullet(player.x + 5, centerY));
      bullets.push(createPlayerBullet(player.x + player.width - 5, centerY));
      break;
    case "spread": {
      const centerX = player.x + player.width / 2;
      bullets.push(createPlayerBullet(centerX, centerY, 0));
      bullets.push(createPlayerBullet(centerX, centerY, -SPREAD_VX));
      bullets.push(createPlayerBullet(centerX, centerY, SPREAD_VX));
      break;
    }
    case "fast":
    case "single":
    default:
      bullets.push(createPlayerBullet(player.x + player.width / 2, centerY));
  }

  playCannonFireSound();
}

function updateShield(now) {
  const ship = getCurrentShip();
  if (!ship.hasShield) return;
  if (!isShielded && now >= shieldReadyAt) {
    isShielded = true;
  }
}

function absorbHitWithShield() {
  const now = performance.now();
  isShielded = false;
  shieldReadyAt = now + SHIELD_RECHARGE_MS;
  invincibleUntil = now + SHIELD_BREAK_IFRAMES_MS;
}

function handleReefCollision() {
  takeDamage();
}

function getBarrelCrop(sprite) {
  const nw = sprite.naturalWidth;
  const nh = sprite.naturalHeight;
  const size = Math.round(Math.min(nw, nh) * 0.78);
  const sx = Math.round((nw - size) / 2);
  const sy = Math.round((nh - size) * 0.06);
  return { sx, sy, sw: size, sh: size };
}

function scheduleNextGuaranteedBarrel(delayMs = GUARANTEED_BARREL_INTERVAL_MS) {
  nextGuaranteedBarrelAt = performance.now() + delayMs;
}

function spawnBarrel(force = false) {
  if (currentSea !== 1 && currentSea !== 2) return false;
  if (!force && barrels.length >= MAX_BARRELS_ON_FIELD) return false;

  const kamikazeOnField = enemies.some((e) => e.kind === ENEMY_KIND.KAMIKAZE);
  let x = pickSpawnX(BARREL_W, {
    kamikazeClear: kamikazeOnField,
    minGap: BARREL_SPAWN_MIN_GAP,
  });

  if (x === null) {
    const laneW = W / SPAWN_LANE_COUNT;
    const lane = Math.floor(Math.random() * SPAWN_LANE_COUNT);
    x = Math.max(0, Math.min(lane * laneW + laneW / 2 - BARREL_W / 2, W - BARREL_W));
  }

  barrels.push({
    x,
    y: -BARREL_H,
    w: BARREL_W,
    h: BARREL_H,
    explosionRadius: BARREL_EXPLOSION_RADIUS,
    speed: randomSpeed(BARREL_SPEED),
  });
  return true;
}

function trySpawnGuaranteedBarrel(now) {
  if (isKrakenBossActive()) return;
  if (currentSea !== 1 && currentSea !== 2) return;
  if (now < nextGuaranteedBarrelAt) return;

  if (spawnBarrel(true)) {
    scheduleNextGuaranteedBarrel();
    return;
  }

  nextGuaranteedBarrelAt = now + 900;
}

function spawnReef() {
  if (currentSea !== 1 && currentSea !== 2) return;
  if (obstacles.length >= MAX_REEFS_ON_FIELD) return;

  const kamikazeOnField = enemies.some((e) => e.kind === ENEMY_KIND.KAMIKAZE);
  const x = pickSpawnX(REEF_W, { kamikazeClear: kamikazeOnField });
  if (x === null) return;

  obstacles.push({
    x,
    y: -REEF_H,
    w: REEF_W,
    h: REEF_H,
    hp: REEF_MAX_HP,
    maxHp: REEF_MAX_HP,
    speed: randomSpeed(REEF_SPEED),
  });
}

function damageReef(reef, amount = 1) {
  reef.hp -= amount;
  return reef.hp <= 0;
}

function removeReefAt(index) {
  obstacles.splice(index, 1);
}

function addExplosionEffect(centerX, centerY, radius) {
  explosionEffects.push({
    x: centerX,
    y: centerY,
    radius,
    startedAt: performance.now(),
    duration: EXPLOSION_FX_DURATION_MS,
  });
}

function explodeBarrel(barrel) {
  const centerX = barrel.x + barrel.w / 2;
  const centerY = barrel.y + barrel.h / 2;

  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    const enemyCenterX = enemy.x + enemy.w / 2;
    const enemyCenterY = enemy.y + enemy.h / 2;
    const dist = Math.hypot(enemyCenterX - centerX, enemyCenterY - centerY);

    if (dist > barrel.explosionRadius) continue;

    if (enemy.kind === ENEMY_KIND.BOSS) {
      enemy.hp = 0;
      destroyEnemy(enemy, ENEMY_DEF[ENEMY_KIND.BOSS].bones);
      onFirstBossDefeated();
    } else {
      destroyEnemy(enemy, ENEMY_DEF[enemy.kind].bones);
    }
    enemies.splice(i, 1);
  }

  playClonedSound(sounds.explosionSound);
  addExplosionEffect(centerX, centerY, barrel.explosionRadius);
}

function detonateBarrel(index, { hurtPlayer = false } = {}) {
  const barrel = barrels[index];
  if (!barrel) return;

  explodeBarrel(barrel);
  barrels.splice(index, 1);

  if (hurtPlayer) {
    takeDamage(2);
  }
}

function bulletHitsBarrel(bullet) {
  for (let i = barrels.length - 1; i >= 0; i--) {
    const barrel = barrels[i];
    if (!circleRectOverlap(bullet.x, bullet.y, getBulletRadius(bullet), barrel)) continue;
    detonateBarrel(i);
    return true;
  }
  return false;
}

function resolveBarrelCollisions(playerRect) {
  for (let i = barrels.length - 1; i >= 0; i--) {
    const barrel = barrels[i];
    if (!rectsOverlap(playerRect, barrel)) continue;
    detonateBarrel(i, { hurtPlayer: true });
  }
}

function bulletHitsReef(bullet) {
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const reef = obstacles[i];
    if (!circleRectOverlap(bullet.x, bullet.y, getBulletRadius(bullet), reef)) continue;
    if (damageReef(reef)) removeReefAt(i);
    return true;
  }
  return false;
}

function resolveReefCollisions(playerRect) {
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const reef = obstacles[i];
    let reefDestroyed = false;

    if (rectsOverlap(playerRect, reef)) {
      handleReefCollision();
      reefDestroyed = damageReef(reef);
    } else {
      for (let j = enemies.length - 1; j >= 0; j--) {
        const enemy = enemies[j];
        if (!rectsOverlap(enemy, reef)) continue;

        reefDestroyed = damageReef(reef);
        if (enemy.kind !== ENEMY_KIND.BOSS) {
          playEnemyExplosionSound();
          enemies.splice(j, 1);
        }
        break;
      }
    }

    if (reefDestroyed) removeReefAt(i);
  }
}

function onSpawnTick(now) {
  if (currentSea === 2 && !isKrakenBossActive()) {
    trySpawnSea2Turtle();
  }

  if (Math.random() < BOOSTER_SPAWN_CHANCE) {
    spawnBooster();
  }

  if (isKrakenBossActive()) return;

  if (currentSea !== 1 && currentSea !== 2) return;

  if (
    obstacles.length < MAX_REEFS_ON_FIELD &&
    now - lastObstacleSpawnTime >= REEF_SPAWN_INTERVAL_MS
  ) {
    lastObstacleSpawnTime = now;
    if (Math.random() < REEF_SPAWN_CHANCE) {
      spawnReef();
    }
  }

  if (
    barrels.length < MAX_BARRELS_ON_FIELD &&
    now - lastBarrelSpawnTime >= BARREL_SPAWN_INTERVAL_MS
  ) {
    lastBarrelSpawnTime = now;
    if (Math.random() < BARREL_SPAWN_CHANCE) {
      spawnBarrel();
    }
  }
}

function rectsOverlap(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function circleRectOverlap(cx, cy, r, rect) {
  const closestX = Math.max(rect.x, Math.min(cx, rect.x + rect.w));
  const closestY = Math.max(rect.y, Math.min(cy, rect.y + rect.h));
  const dx = cx - closestX;
  const dy = cy - closestY;
  return dx * dx + dy * dy < r * r;
}

function getPlayerRect() {
  return { x: player.x, y: player.y, w: player.width, h: player.height };
}

function hideGameOver() {
  setOverlayVisible(gameOverOverlay, false);
}

function hideVictory() {
  if (victoryOverlay) setOverlayVisible(victoryOverlay, false);
}

function showGameOver() {
  setGameState(GameState.GAMEOVER);
  clearKeys();
  stopKrakenBossMusic();
  stopSea2Music();
  finalBonesEl.textContent = formatNum(bones);
  hideVictory();
  setOverlayVisible(gameOverOverlay, true);
  playSound(sounds.gameOverSound);
}

function showVictory() {
  setGameState(GameState.VICTORY);
  clearKeys();
  stopKrakenBossMusic();
  if (victoryBonesEl) victoryBonesEl.textContent = formatNum(bones);
  hideGameOver();
  setOverlayVisible(victoryOverlay, true);
  playClonedSound(sounds.explosionSound);
}

function resetRun() {
  applySelectedShip();
  if (devForceHp > 0) {
    maxHp = devForceHp;
  }
  bullets = [];
  enemyBullets = [];
  obstacles = [];
  barrels = [];
  explosionEffects = [];
  enemies = [];
  turtleEnemies = [];
  boosters = [];
  bones = 0;
  currentSea = 1;
  seaTransitionTextUntil = 0;
  setCanvasSeaBackground();
  boneGalleonSpawned = false;
  hp = maxHp;
  invincibleUntil = 0;
  isShielded = false;
  shieldReadyAt = 0;
  const runStart = performance.now();
  lastSpawnTime = runStart;
  lastEnemySpawnTime = runStart;
  lastObstacleSpawnTime = runStart;
  lastBarrelSpawnTime = runStart;
  nextGuaranteedBarrelAt = 0;
  sea2BonesBaseline = 0;
  sea2TurtlesSpawned = 0;
  hasMonsterAppeared = false;
  sea2MonsterRow = null;
  sea2MonsterAllowedAfter = 0;
  sea2CropTemplate = null;
  turtleKillCount = 0;
  resetKraken();
  lastFireTime = 0;
  keys.left = false;
  keys.right = false;
  keys.up = false;
  keys.down = false;
  player.x = W / 2 - player.width / 2;
  player.y = H - player.height - 18;
}

function startGame() {
  menuMusicUnlocked = true;
  stopMenuMusic();
  resetRun();
  initWaterTiles();
  gameStartTime = performance.now();
  const ship = getCurrentShip();
  if (ship.hasShield) {
    isShielded = true;
    shieldReadyAt = 0;
  }
  hideAllMenus();
  hideGameOver();
  hideVictory();
  setGameState(GameState.PLAYING);
  setCanvasSeaBackground();
  seedEnemyConvoy();
  scheduleNextGuaranteedBarrel(FIRST_BARREL_DELAY_MS);
  playSea2Music();
  showGameHud();
  requestAnimationFrame(() => focusGame());
}

function returnToMainMenu() {
  progress.totalBones += bones;
  if (bones > progress.maxBones) {
    progress.maxBones = bones;
  }
  saveProgress();

  resetRun();
  hideGameOver();
  hideVictory();
  showMainMenu();
}

function takeDamage(amount = 1) {
  const now = performance.now();
  if (now < invincibleUntil || !isPlaying()) return;

  const ship = getCurrentShip();
  if (ship.hasShield && isShielded) {
    absorbHitWithShield();
    return;
  }

  hp -= amount;
  invincibleUntil = now + INVINCIBLE_MS;
  playClonedSound(sounds.hitSound);

  if (hp <= 0) {
    hp = 0;
    showGameOver();
  }
}

function update(dt) {
  if (gameState === GameState.VICTORY) return;
  if (!isPlaying()) return;

  if (isGrabbed) {
    updateKrakenGrab(dt);
  } else {
    if (keys.left) player.x -= playerSpeed * dt;
    if (keys.right) player.x += playerSpeed * dt;
    if (keys.up) player.y -= playerSpeed * dt;
    if (keys.down) player.y += playerSpeed * dt;
  }

  player.x = Math.max(0, Math.min(player.x, W - player.width));
  player.y = Math.max(0, Math.min(player.y, H - player.height));

  const now = performance.now();
  updateShield(now);
  trySpawnBoss();

  bullets = bullets.filter((b) => {
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    if (bulletHitsBarrel(b)) return false;
    if (bulletHitsKraken(b)) return false;
    if (bulletHitsTurtle(b)) return false;
    if (bulletHitsReef(b)) return false;
    return (
      b.y + b.radius > 0 &&
      b.y - b.radius < H &&
      b.x + b.radius > 0 &&
      b.x - b.radius < W
    );
  });

  const playerRect = getPlayerRect();

  enemyBullets = enemyBullets.filter((b) => {
    b.x += b.vx * dt;
    b.y += b.vy * dt;

    if (
      performance.now() >= invincibleUntil &&
      circleRectOverlap(b.x, b.y, getBulletRadius(b), playerRect)
    ) {
      takeDamage();
      return false;
    }

    if (bulletHitsReef(b)) return false;

    return (
      b.y - b.radius < H &&
      b.y + b.radius > 0 &&
      b.x + b.radius > 0 &&
      b.x - b.radius < W
    );
  });

  updateEnemyConveyor(now);

  trySpawnGuaranteedBarrel(now);

  if (currentSea === 2) {
    updateKrakenBoss(dt);
    if (!isKrakenBossActive()) {
      trySpawnSea2Turtle();
    }
  }

  if (now - lastSpawnTime >= SPAWN_INTERVAL_MS) {
    onSpawnTick(now);
    lastSpawnTime = now;
  }

  enemies = enemies.filter((enemy) => {
    updateEnemyEntity(enemy, dt, now);

    if (enemy.kind === ENEMY_KIND.KAMIKAZE && enemy.y > H) {
      failFromKamikazeEscape();
      return false;
    }

    if (hitEnemyWithBullets(enemy)) {
      return false;
    }

    if (rectsOverlap(playerRect, enemy)) {
      handleReefCollision();
    }

    if (enemy.kind === ENEMY_KIND.BOSS) {
      return enemy.hp > 0 && enemy.y < H + enemy.h;
    }

    return enemy.y < H + enemy.h;
  });

  if (currentSea === 1 || currentSea === 2) {
    obstacles.forEach((reef) => {
      reef.y += reef.speed * dt;
    });
    resolveReefCollisions(playerRect);
    obstacles = obstacles.filter((reef) => reef.y < H + reef.h);

    barrels.forEach((barrel) => {
      barrel.y += barrel.speed * dt;
    });
    resolveBarrelCollisions(playerRect);
    barrels = barrels.filter((barrel) => barrel.y < H + barrel.h);
  }

  if (currentSea === 2) {
    updateSea2WaterMonster();

    if (!isKrakenBossActive()) {
      turtleEnemies = turtleEnemies.filter((turtle) => {
        turtle.y += turtle.speed * dt;

        if (rectsOverlap(playerRect, turtle)) {
          takeDamage(TURTLE_COLLISION_DAMAGE);
          playClonedSound(sounds.explosionSound);
          onTurtleDestroyed();
          return false;
        }

        return turtle.y < H + turtle.h;
      });
    }
  }

  const fxNow = performance.now();
  explosionEffects = explosionEffects.filter((fx) => fxNow - fx.startedAt < fx.duration);

  boosters = boosters.filter((booster) => {
    booster.y += booster.speed * dt;

    if (rectsOverlap(playerRect, booster)) {
      pickupRepairBooster();
      return false;
    }

    return booster.y < H + booster.h;
  });
}

function getWaterTileSize() {
  const tile = sprites.water1;
  if (isImageReady(tile)) {
    return { w: tile.naturalWidth, h: tile.naturalHeight };
  }
  return { w: 64, h: 64 };
}

// Стабильный индекс плитки по координатам «мира» — без внезапного спавна новых рядов
function getWaterTileIndex(col, worldRow) {
  const hash = col * 374761 + worldRow * 668265;
  return ((hash ^ (hash >> 13)) >>> 0) % WATER_TILE_KEYS.length;
}

function initWaterTiles() {
  const size = getWaterTileSize();
  waterTileW = size.w;
  waterTileH = size.h;
  waterCols = Math.ceil(W / waterTileW) + 1;
}

function buildSea2CropTemplate() {
  const ref = sea2Water1;
  const nw = ref.naturalWidth;
  const nh = ref.naturalHeight;
  const sw = Math.round(nw * 0.94);
  const sh = Math.round(nh * 0.4);
  const sx = Math.round((nw - sw) / 2);
  const sy = Math.round(nh * 0.26);

  sea2CropTemplate = { sw, sh, sx, sy, refNh: nh };
}

function getSea2WaterCrop(sprite) {
  if (!sea2CropTemplate) {
    buildSea2CropTemplate();
  }

  const { sw, sh, sy: refSy, refNh } = sea2CropTemplate;
  const nw = sprite.naturalWidth;
  const nh = sprite.naturalHeight;
  const sx = Math.round((nw - sw) / 2);
  const sy = Math.round((refSy / refNh) * nh);

  return { sx, sy, sw, sh };
}

function getSea2RowStep() {
  return Math.max(1, sea2TileH - SEA2_ROW_OVERLAP);
}

function ensureSea2WaterMetrics() {
  if (!isImageReady(sea2Water1)) return false;

  if (!sea2CropTemplate) {
    buildSea2CropTemplate();
  }

  const { sw, sh } = sea2CropTemplate;
  const nextH = Math.max(1, Math.round(W * (sh / sw)));

  sea2TileW = W;
  sea2TileH = nextH;
  sea2WaterCols = 1;
  return true;
}

function updateSea2WaterMonster() {
  if (hasMonsterAppeared) return;

  const step = getSea2RowStep();
  if (step < 1) return;

  const now = performance.now();

  if (sea2MonsterRow === null && now >= sea2MonsterAllowedAfter) {
    const currentRow = Math.floor(waterOffsetY / step);
    let targetRow = currentRow + Math.ceil(H / step) + 2;
    if (targetRow % 2 !== 1) {
      targetRow += 1;
    }
    sea2MonsterRow = targetRow;
  }

  if (sea2MonsterRow !== null && Math.floor(waterOffsetY / step) > sea2MonsterRow + 1) {
    hasMonsterAppeared = true;
    sea2MonsterRow = null;
  }
}

function getSea2TileForRow(worldRow) {
  if (sea2MonsterRow !== null && worldRow === sea2MonsterRow) {
    return sea2Water3;
  }

  let cycleRow = worldRow;
  if (sea2MonsterRow !== null && worldRow > sea2MonsterRow) {
    cycleRow = worldRow - 1;
  }

  return cycleRow % 2 === 0 ? sea2Water1 : sea2Water2;
}

function drawSea2() {
  ctx.fillStyle = SEA_2_COLOR;
  ctx.fillRect(0, 0, W, H);

  if (!ensureSea2WaterMetrics()) return;

  const th = sea2TileH;
  const step = getSea2RowStep();
  const drawH = th + SEA2_ROW_OVERLAP;
  const scrollY = ((waterOffsetY % step) + step) % step;
  const startWorldRow = Math.floor(waterOffsetY / step);
  const rowCount = Math.ceil((H + drawH) / step) + 4;
  const prevSmooth = ctx.imageSmoothingEnabled;

  ctx.imageSmoothingEnabled = false;

  for (let row = -2; row < rowCount; row++) {
    const screenY = row * step - scrollY;
    if (screenY > H + 2) break;
    if (screenY + drawH < -2) continue;

    const tile = getSea2TileForRow(startWorldRow + row);
    if (!isImageReady(tile)) continue;

    const crop = getSea2WaterCrop(tile);
    ctx.drawImage(tile, crop.sx, crop.sy, crop.sw, crop.sh, -1, screenY, W + 2, drawH);
  }

  ctx.imageSmoothingEnabled = prevSmooth;
}

function drawSea() {
  if (currentSea === 2) {
    drawSea2();
    return;
  }

  ctx.fillStyle = SEA_COLOR;
  ctx.fillRect(0, 0, W, H);

  const sample = sprites.water1;
  if (!isImageReady(sample)) {
    return;
  }

  if (waterTileW <= 0 || waterCols <= 0) {
    initWaterTiles();
  }

  const tw = waterTileW;
  const th = waterTileH;

  if (th < 1 || tw < 1) {
    ctx.fillStyle = SEA_COLOR;
    ctx.fillRect(0, 0, W, H);
    return;
  }

  const scrollY = ((waterOffsetY % th) + th) % th;
  const startWorldRow = Math.floor(waterOffsetY / th);
  const maxRows = Math.ceil((H + th) / th) + 2;

  // Конвейер: один непрерывный поток плиток, сдвиг по sub-pixel offset
  for (let row = 0; row < maxRows; row++) {
    const screenY = row * th - scrollY;
    if (screenY >= H + th) break;

    const worldRow = startWorldRow + row;

    for (let col = 0; col < waterCols; col++) {
      const tileKey = WATER_TILE_KEYS[getWaterTileIndex(col, worldRow)];
      const tile = sprites[tileKey];
      if (isImageReady(tile)) {
        ctx.drawImage(tile, col * tw, screenY, tw, th);
      }
    }
  }
}

function drawShield() {
  const ship = getCurrentShip();
  if (!ship.hasShield || !isShielded) return;

  const cx = player.x + player.width / 2;
  const cy = player.y + player.height / 2;
  const radius = Math.max(player.width, player.height) * 0.72;
  const pulse = 0.12 + Math.sin(performance.now() * 0.008) * 0.06;

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(90, 200, 255, ${pulse + 0.1})`;
  ctx.fill();
  ctx.strokeStyle = "rgba(160, 235, 255, 0.9)";
  ctx.lineWidth = 3;
  ctx.stroke();
}

function drawPlayerShip() {
  drawShield();

  const blinkOff =
    performance.now() < invincibleUntil &&
    Math.floor(performance.now() / 120) % 2 === 0;
  if (blinkOff) return;

  const { x, y, width, height, hull, mast, image } = player;
  const sprite = getSpriteByPath(image);

  if (isImageReady(sprite)) {
    const crop = getVerticalShipCrop(sprite);
    drawSpriteCropInBox(sprite, crop, x, y, width, height, true);
    return;
  }

  ctx.fillStyle = hull;
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = mast;
  ctx.fillRect(x + width * 0.35, y - 12, width * 0.3, 12);
}

function drawBulletSprite(bullet, sprite) {
  const size = Math.min(bullet.w, bullet.h);
  const radius = size / 2;

  if (isImageReady(sprite)) {
    const crop = getBulletCrop(sprite);
    const drawX = Math.round(bullet.x - radius);
    const drawY = Math.round(bullet.y - radius);

    ctx.save();
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, radius, 0, Math.PI * 2);
    ctx.clip();
    drawSpriteCropInBox(sprite, crop, drawX, drawY, size, size, true);
    ctx.restore();
    return;
  }

  const fallback = bullet.type === BULLET_TYPE.ENEMY ? "#ff6b4a" : "#3ecf6e";
  ctx.beginPath();
  ctx.arc(bullet.x, bullet.y, getBulletRadius(bullet), 0, Math.PI * 2);
  ctx.fillStyle = fallback;
  ctx.fill();
}

function drawPlayerBullet(b) {
  drawBulletSprite(b, sprites.bulletPlayer);
}

function drawEnemyBullet(b) {
  drawBulletSprite(b, sprites.bulletEnemy);
}

function getTurtleCrop(sprite) {
  const nw = sprite.naturalWidth;
  const nh = sprite.naturalHeight;
  const sw = Math.round(nw * 0.52);
  const sh = Math.round(nh * 0.74);
  const sx = Math.round((nw - sw) / 2);
  const sy = Math.round((nh - sh) * 0.06);
  return { sx, sy, sw, sh };
}

function drawTurtle(turtle) {
  if (isImageReady(turtleImg)) {
    const crop = getTurtleCrop(turtleImg);
    drawSpriteCropInBox(turtleImg, crop, turtle.x, turtle.y, turtle.w, turtle.h, true);
  } else {
    ctx.fillStyle = "#2a4a38";
    ctx.fillRect(Math.round(turtle.x), Math.round(turtle.y), Math.round(turtle.w), Math.round(turtle.h));
    ctx.fillStyle = "#c03030";
    ctx.beginPath();
    ctx.arc(turtle.x + turtle.w * 0.35, turtle.y + turtle.h * 0.35, 5, 0, Math.PI * 2);
    ctx.arc(turtle.x + turtle.w * 0.65, turtle.y + turtle.h * 0.35, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  if (turtle.hp < turtle.maxHp) {
    const barW = turtle.w * 0.7;
    const barH = 5;
    const bx = turtle.x + (turtle.w - barW) / 2;
    const by = turtle.y - 8;
    const ratio = turtle.hp / turtle.maxHp;

    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx.fillRect(bx - 1, by - 1, barW + 2, barH + 2);
    ctx.fillStyle = "#5a1010";
    ctx.fillRect(bx, by, barW, barH);
    ctx.fillStyle = "#e04040";
    ctx.fillRect(bx, by, barW * ratio, barH);
  }
}

function drawBarrel(barrel) {
  if (isImageReady(barrelImg)) {
    const crop = getBarrelCrop(barrelImg);
    drawSpriteCropInBox(barrelImg, crop, barrel.x, barrel.y, barrel.w, barrel.h, true);
    return;
  }

  const drawX = Math.round(barrel.x);
  const drawY = Math.round(barrel.y);
  const drawW = Math.round(barrel.w);
  const drawH = Math.round(barrel.h);
  ctx.fillStyle = "#4a2818";
  ctx.fillRect(drawX, drawY, drawW, drawH);
  ctx.fillStyle = "#ff6b20";
  ctx.beginPath();
  ctx.arc(drawX + drawW / 2, drawY + drawH * 0.25, drawW * 0.22, 0, Math.PI * 2);
  ctx.fill();
}

function drawExplosionEffects(now) {
  for (const fx of explosionEffects) {
    const t = Math.min(1, (now - fx.startedAt) / fx.duration);
    const alpha = 0.6 * (1 - t);

    ctx.save();
    ctx.globalAlpha = alpha;
    const gradient = ctx.createRadialGradient(fx.x, fx.y, 0, fx.x, fx.y, fx.radius);
    gradient.addColorStop(0, "rgba(255, 230, 90, 0.95)");
    gradient.addColorStop(0.4, "rgba(255, 90, 30, 0.8)");
    gradient.addColorStop(1, "rgba(140, 20, 10, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(fx.x, fx.y, fx.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawReef(reef) {
  const hpRatio = reef.hp / reef.maxHp;
  const drawX = Math.round(reef.x);
  const drawY = Math.round(reef.y);
  const drawW = Math.round(reef.w);
  const drawH = Math.round(reef.h);

  ctx.save();

  if (reef.hp < reef.maxHp) {
    ctx.globalAlpha = 0.55 + 0.45 * hpRatio;
  }

  if (isImageReady(reefImg)) {
    ctx.drawImage(reefImg, drawX, drawY, drawW, drawH);
  } else {
    ctx.fillStyle = "#2a4a6b";
    ctx.fillRect(drawX, drawY, drawW, drawH);
    ctx.fillStyle = "#d8c8a8";
    ctx.beginPath();
    ctx.arc(drawX + drawW * 0.35, drawY + drawH * 0.45, drawW * 0.12, 0, Math.PI * 2);
    ctx.arc(drawX + drawW * 0.65, drawY + drawH * 0.5, drawW * 0.1, 0, Math.PI * 2);
    ctx.fill();
  }

  if (reef.hp < reef.maxHp) {
    ctx.globalAlpha = 0.22 * (1 - hpRatio);
    ctx.fillStyle = "#ff5a4a";
    ctx.fillRect(drawX, drawY, drawW, drawH);
  }

  ctx.restore();
}

function drawEnemyShip(enemy) {
  const def = ENEMY_DEF[enemy.kind];
  const sprite = sprites[def.sprite];

  if (isImageReady(sprite)) {
    if (enemy.kind === ENEMY_KIND.BOSS) {
      drawSpriteInBox(sprite, enemy.x, enemy.y, enemy.w, enemy.h);
    } else {
      const crop = getVerticalShipCrop(sprite);
      drawSpriteCropInBox(sprite, crop, enemy.x, enemy.y, enemy.w, enemy.h, true);
    }
    return;
  }

  ctx.fillStyle = enemy.kind === ENEMY_KIND.BOSS ? "#4a1020" : "#b22222";
  ctx.fillRect(
    Math.round(enemy.x),
    Math.round(enemy.y),
    Math.round(enemy.w),
    Math.round(enemy.h)
  );
}

function drawKraken() {
  if (!kraken.active) return;

  const sprite = kraken.isDead ? sea2KrakenDead : sea2KrakenAlive;
  if (!isImageReady(sprite)) {
    ctx.fillStyle = "#5a1848";
    ctx.strokeStyle = "#ff6b8a";
    ctx.lineWidth = 3;
    ctx.fillRect(kraken.x, kraken.y, kraken.w, kraken.h);
    ctx.strokeRect(kraken.x + 1, kraken.y + 1, kraken.w - 2, kraken.h - 2);
    ctx.font = 'bold 14px "Press Start 2P", monospace';
    ctx.fillStyle = "#ffd966";
    ctx.textAlign = "center";
    ctx.fillText("КРАКЕН", kraken.x + kraken.w / 2, kraken.y + kraken.h / 2);
    return;
  }

  const prevSmooth = ctx.imageSmoothingEnabled;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  drawSpriteInBox(sprite, kraken.x, kraken.y, kraken.w, kraken.h);
  ctx.imageSmoothingEnabled = prevSmooth;
}

function getTentacleDrawAlpha(now) {
  if (isGrabbed) return 1;
  if (now >= tentacleFadeUntil) return 0;
  return (tentacleFadeUntil - now) / TENTACLE_FADE_MS;
}

function shouldDrawKrakenTentacle(now) {
  return isGrabbed || now < tentacleFadeUntil;
}

function drawKrakenTentacle(now) {
  if (!shouldDrawKrakenTentacle(now)) return;

  const alpha = getTentacleDrawAlpha(now);
  if (alpha <= 0) return;

  const sway = Math.sin(now / 100) * 2;
  const boxX = player.x + player.width / 2 - KRAKEN_TENTACLE_W / 2;
  const boxY = player.y + player.height * 0.1 + sway;

  ctx.save();
  ctx.globalAlpha = alpha;

  if (isImageReady(tentacleImg)) {
    const prevSmooth = ctx.imageSmoothingEnabled;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    drawSpriteInBox(tentacleImg, boxX, boxY, KRAKEN_TENTACLE_W, KRAKEN_TENTACLE_H);
    ctx.imageSmoothingEnabled = prevSmooth;
  } else {
    ctx.fillStyle = "#2a1838";
    ctx.fillRect(boxX, boxY, KRAKEN_TENTACLE_W, KRAKEN_TENTACLE_H);
    ctx.strokeStyle = "#8a4060";
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX + 1, boxY + 1, KRAKEN_TENTACLE_W - 2, KRAKEN_TENTACLE_H - 2);
  }

  ctx.restore();
}

function drawSea2EffectSprite(img, x, y, w, h, alpha = 1) {
  if (!isImageReady(img)) return false;

  const prevSmooth = ctx.imageSmoothingEnabled;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.globalCompositeOperation = "screen";
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  ctx.restore();
  ctx.imageSmoothingEnabled = prevSmooth;
  return true;
}

function drawWhirlpools(now) {
  if (!whirlpools.length) return;

  const elapsed = Math.max(0, KRAKEN_WHIRLPOOL_DURATION_MS - Math.max(0, kraken.whirlpoolEndsAt - now));
  const lifeLeft = Math.max(0, kraken.whirlpoolEndsAt - now);
  const fadeIn = Math.min(1, elapsed / 180);
  const fadeOut = Math.min(1, lifeLeft / 380);
  const alpha = Math.max(0.55, Math.min(fadeIn, fadeOut));

  for (const pool of whirlpools) {
    const cx = pool.x + pool.w / 2;
    const cy = pool.y + pool.h / 2;
    const spin = pool.spinPhase + now * 0.004;
    const pulse = 1 + Math.sin(now * 0.008 + pool.spinPhase) * 0.06;
    const drawW = pool.w * pulse;
    const drawH = pool.h * pulse;
    const dx = cx - drawW / 2;
    const dy = cy - drawH / 2;

    if (!drawSea2EffectSprite(whirlpoolImg, dx, dy, drawW, drawH, alpha)) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "rgba(220, 240, 255, 0.75)";
      ctx.beginPath();
      ctx.ellipse(cx, cy, drawW * 0.42, drawH * 0.36, spin, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}

function drawKrakenLaserBeam(now) {
  if (!isKrakenLaserPhase() || !isLaserFiring) return;

  const laserRect = getKrakenLaserHitbox();
  const fireElapsed = Math.max(0, now - kraken.laserChargeEndsAt);
  const fadeIn = Math.min(1, fireElapsed / 180);
  const fadeOut = Math.min(1, (kraken.laserEndsAt - now) / 260);
  const alpha = Math.max(0.65, Math.min(fadeIn, fadeOut));
  const pulse = 1 + Math.sin(now * 0.018) * 0.05;
  const drawW = laserRect.w * pulse;
  const dx = laserRect.x + (laserRect.w - drawW) / 2;

  if (!drawSea2EffectSprite(laserImg, dx, laserRect.y, drawW, laserRect.h, alpha)) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(120, 255, 200, 0.55)";
    ctx.fillRect(laserRect.x, laserRect.y, laserRect.w, laserRect.h);
    ctx.strokeStyle = "rgba(200, 255, 240, 0.9)";
    ctx.lineWidth = 3;
    ctx.strokeRect(laserRect.x + 1, laserRect.y + 1, laserRect.w - 2, laserRect.h - 2);
    ctx.restore();
  }
}

function drawKrakenQuestionMark(now) {
  if (!isKrakenLaserPhase() || !isLaserCharging) return;

  const size = KRAKEN_QUESTION_MARK_SIZE;
  const pulse = 1 + Math.sin(now * 0.012) * 0.16;
  const drawSize = size * pulse;
  const x = kraken.x + kraken.w / 2 - drawSize / 2;
  const y = kraken.y - drawSize - 14;
  const bob = Math.sin(now / 100) * 4;

  if (!drawSea2EffectSprite(questionMarkImg, x, y + bob, drawSize, drawSize, 1)) {
    ctx.save();
    ctx.fillStyle = "#ffd966";
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.font = `bold ${Math.round(drawSize * 0.85)}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeText("?", kraken.x + kraken.w / 2, y + bob + drawSize / 2);
    ctx.fillText("?", kraken.x + kraken.w / 2, y + bob + drawSize / 2);
    ctx.restore();
  }
}

function drawKrakenIntroBanner(now) {
  if (!kraken.active || kraken.phase !== "intro" || now >= kraken.introUntil) return;

  const cx = W / 2;
  const cy = 72;
  const alpha = Math.min(1, (kraken.introUntil - now) / 600);

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = 'bold 22px "Press Start 2P", monospace';
  ctx.strokeStyle = "#1a0202";
  ctx.lineWidth = 6;
  ctx.fillStyle = "#ff5a4a";
  ctx.strokeText("ГНЕВ КРАКЕНА", cx, cy);
  ctx.fillText("ГНЕВ КРАКЕНА", cx, cy);
  ctx.font = 'bold 11px "Press Start 2P", monospace';
  ctx.fillStyle = "#ffd966";
  ctx.fillText("ФИНАЛЬНЫЙ БОСС", cx, cy + 28);
  ctx.restore();
}

function drawKrakenHealthBar() {
  if (!kraken.active || kraken.sinking) return;

  const barW = 300;
  const barH = 16;
  const x = (W - barW) / 2;
  const y = 12;
  const ratio = Math.max(0, kraken.hp / kraken.maxHp);

  ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
  ctx.fillRect(x - 2, y - 2, barW + 4, barH + 4);
  ctx.fillStyle = "rgba(60, 10, 20, 0.9)";
  ctx.fillRect(x, y, barW, barH);
  ctx.fillStyle = "#c03050";
  ctx.fillRect(x, y, barW * ratio, barH);
  ctx.strokeStyle = "#ff6b8a";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, barW, barH);
  ctx.font = "bold 12px system-ui, sans-serif";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "left";
  ctx.fillText(`КРАКЕН ${kraken.hp}/${kraken.maxHp}`, x + 8, y + 12);
}

function drawBossHealthBar() {
  const boss = getActiveBoss();
  if (!boss) return;

  const barW = 280;
  const barH = 14;
  const x = (W - barW) / 2;
  const y = 10;
  const ratio = Math.max(0, boss.hp / boss.maxHp);

  ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
  ctx.fillRect(x - 2, y - 2, barW + 4, barH + 4);
  ctx.fillStyle = "rgba(80, 20, 20, 0.9)";
  ctx.fillRect(x, y, barW, barH);
  ctx.fillStyle = "#e74c3c";
  ctx.fillRect(x, y, barW * ratio, barH);
  ctx.strokeStyle = "#ffd966";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, barW, barH);
  ctx.font = "bold 12px system-ui, sans-serif";
  ctx.fillStyle = "#fff";
  ctx.fillText(`Костяной Галеон ${boss.hp}/${boss.maxHp}`, x + 8, y + 11);
}

function drawBooster(booster) {
  const sprite = sprites.bochkaRepair;

  if (isImageReady(sprite)) {
    const crop = getBochkaRepairCrop(sprite);
    drawSpriteCropInBox(sprite, crop, booster.x, booster.y, booster.w, booster.h, true);
    return;
  }

  ctx.fillStyle = "#6b3e1e";
  ctx.fillRect(
    Math.round(booster.x),
    Math.round(booster.y),
    Math.round(booster.w),
    Math.round(booster.h)
  );
  ctx.fillStyle = "#3ecf6e";
  ctx.fillRect(
    Math.round(booster.x + booster.w * 0.35),
    Math.round(booster.y + booster.h * 0.25),
    Math.round(booster.w * 0.3),
    Math.round(booster.h * 0.35)
  );
}

function drawSeaTransitionText(now) {
  if (!seaTransitionTextUntil || now >= seaTransitionTextUntil) return;

  const elapsed = SEA_TRANSITION_MS - (seaTransitionTextUntil - now);
  let alpha = 1;
  if (elapsed > SEA_TRANSITION_HOLD_MS) {
    alpha = Math.max(0, 1 - (elapsed - SEA_TRANSITION_HOLD_MS) / SEA_TRANSITION_FADE_MS);
  }

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const cx = W / 2;
  const cy = H / 2;

  ctx.font = 'bold 26px "Press Start 2P", monospace';
  ctx.strokeStyle = "#1a0202";
  ctx.lineWidth = 6;
  ctx.fillStyle = "#ff9a8a";
  ctx.strokeText("ВТОРОЕ МОРЕ", cx, cy - 22);
  ctx.fillText("ВТОРОЕ МОРЕ", cx, cy - 22);

  ctx.font = 'bold 14px "Press Start 2P", monospace';
  ctx.fillStyle = "#e85c4a";
  ctx.strokeText("БАГРОВЫЕ ВОДЫ", cx, cy + 18);
  ctx.fillText("БАГРОВЫЕ ВОДЫ", cx, cy + 18);

  ctx.restore();
}

function drawFrame() {
  const now = performance.now();
  drawSea();
  if (currentSea === 1 || currentSea === 2) {
    obstacles.forEach(drawReef);
    barrels.forEach(drawBarrel);
    enemies.forEach(drawEnemyShip);
  }
  drawExplosionEffects(now);
  drawWhirlpools(now);
  if (currentSea === 2) {
    if (!isKrakenBossActive()) {
      turtleEnemies.forEach(drawTurtle);
    }
  }
  boosters.forEach(drawBooster);
  enemyBullets.forEach(drawEnemyBullet);
  bullets.forEach(drawPlayerBullet);
  drawPlayerShip();
  drawKrakenLaserBeam(now);
  drawKrakenTentacle(now);
  if (currentSea === 2) {
    drawKraken();
    drawKrakenQuestionMark(now);
  }
  drawKrakenHealthBar();
  drawBossHealthBar();
  drawKrakenIntroBanner(now);
  drawSeaTransitionText(now);
  drawKrakenQteOverlay(performance.now());

  if (isPlaying()) {
    updateGameHud();
  }
}

function drawKrakenQteOverlay(now) {
  if (isKrakenLaserPhase()) {
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const cx = W / 2;
    const cy = H / 2 - 36;

    ctx.font = 'bold 16px "Press Start 2P", monospace';
    ctx.strokeStyle = "#1a0202";
    ctx.lineWidth = 5;
    ctx.fillStyle = isLaserCharging ? "#ffd966" : "#ff6b9a";
    const title = isLaserCharging ? "МАГИЧЕСКИЙ ЛУЧ!" : "ЛУЧ!";
    ctx.strokeText(title, cx, cy);
    ctx.fillText(title, cx, cy);
    ctx.font = 'bold 10px "Press Start 2P", monospace';
    ctx.fillStyle = "#9ed4ff";
    ctx.fillText(
      isLaserCharging ? "Отплыви влево или вправо!" : "Беги от центра!",
      cx,
      cy + 22
    );
    ctx.restore();
    return;
  }

  if (isKrakenWhirlpoolPhase()) {
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = 'bold 16px "Press Start 2P", monospace';
    ctx.strokeStyle = "#1a0202";
    ctx.lineWidth = 5;
    ctx.fillStyle = "#9ed4ff";
    const cx = W / 2;
    const cy = H / 2 - 40;
    ctx.strokeText("ВИХРИ!", cx, cy);
    ctx.fillText("ВИХРИ!", cx, cy);
    ctx.font = 'bold 10px "Press Start 2P", monospace';
    ctx.fillStyle = "#ffd966";
    ctx.fillText("Две линии вихрей — беги в центр!", cx, cy + 24);
    ctx.restore();
    return;
  }

  if (!isGrabbed) return;

  ctx.save();
  ctx.fillStyle = "rgba(90, 8, 8, 0.48)";
  ctx.fillRect(0, 0, W, H);

  const pulse = 0.55 + Math.sin(now * 0.012) * 0.15;
  ctx.globalAlpha = pulse;
  ctx.fillStyle = "rgba(180, 20, 20, 0.25)";
  ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = 1;

  const cx = W / 2;
  const cy = H / 2;
  const errorFlash = now < krakenQteErrorUntil;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.font = 'bold 20px "Press Start 2P", monospace';
  ctx.strokeStyle = "#1a0202";
  ctx.lineWidth = 5;
  ctx.fillStyle = errorFlash ? "#ff4444" : "#ff8a7a";
  ctx.strokeText("КРАКЕН ХВАТАЕТ!", cx, cy - 58);
  ctx.fillText("КРАКЕН ХВАТАЕТ!", cx, cy - 58);

  ctx.font = 'bold 12px "Press Start 2P", monospace';
  ctx.fillStyle = "#ffd966";
  ctx.fillText("Нажми:", cx, cy - 28);

  const keySize = 34;
  const gap = 10;
  const totalW = requiredKeys.length * keySize + (requiredKeys.length - 1) * gap;
  let x = cx - totalW / 2;
  const keyY = cy + 6;

  requiredKeys.forEach((key, index) => {
    let bg = "#3a2028";
    let border = "#6a4048";
    let textColor = "#c8a8a8";

    if (index < currentQteIndex) {
      bg = "#1f5c32";
      border = "#4aff7a";
      textColor = "#b8ffd0";
    } else if (index === currentQteIndex) {
      bg = errorFlash ? "#5c1010" : "#4a3010";
      border = errorFlash ? "#ff3333" : "#ffd966";
      textColor = errorFlash ? "#ffb0b0" : "#fff3c0";
    }

    ctx.fillStyle = bg;
    ctx.fillRect(Math.round(x), Math.round(keyY), keySize, keySize);
    ctx.strokeStyle = border;
    ctx.lineWidth = 3;
    ctx.strokeRect(Math.round(x) + 1, Math.round(keyY) + 1, keySize - 2, keySize - 2);

    ctx.fillStyle = textColor;
    ctx.font = 'bold 16px "Press Start 2P", monospace';
    ctx.fillText(getQteKeyLabel(key), x + keySize / 2, keyY + keySize / 2 + 2);

    x += keySize + gap;
  });

  ctx.font = '10px "Press Start 2P", monospace';
  ctx.fillStyle = "#ffaaaa";
  ctx.fillText("Сжатие: -1 HP", cx, cy + 58);

  ctx.restore();
}

function initMenu() {
  document.getElementById("playBtn").addEventListener("click", (e) => {
    e.currentTarget.blur();
    startGame();
  });
  document.getElementById("shopBtn").addEventListener("click", showShopMenu);
  document.getElementById("recordsBtn").addEventListener("click", showRecordsMenu);
  document.getElementById("developerBtn").addEventListener("click", showDeveloperMenu);
  document.getElementById("devAccessBtn").addEventListener("click", () => {
    const code = prompt("Введите код доступа:");
    if (code === "3050") {
      showSecretMenu();
    } else if (code !== null) {
      alert("Неверный код.");
    }
  });
  document.getElementById("devQuickAccessBtn")?.addEventListener("click", toggleDevQuickAccess);
  document.getElementById("devAuthorsBtn")?.addEventListener("click", showAuthorsOverlay);
  authorsOverlay?.addEventListener("click", hideAuthorsOverlay);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && authorsOverlay && !authorsOverlay.classList.contains("hidden")) {
      hideAuthorsOverlay();
    }
  });
  setDevQuickAccessVisible(false);
  document.getElementById("secretBonesBtn").addEventListener("click", () => {
    progress.totalBones += 1_000_000;
    saveProgress();
    updateMenuDisplays();
    renderShop();
    alert("+1 000 000 костей добавлено.");
  });

  document.getElementById("secretHpBtn").addEventListener("click", () => {
    cheatHP();
    alert("1000 HP активировано. Нажмите «Играть» или продолжите текущий заезд.");
  });

  document.querySelectorAll("[data-back='main']").forEach((btn) => {
    btn.addEventListener("click", showMainMenu);
  });

  shopList.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn || btn.disabled) return;
    const { action, shipId } = btn.dataset;
    if (action === "buy") buyShip(shipId);
    if (action === "select") selectShip(shipId);
  });

  menuBtn.addEventListener("click", returnToMainMenu);
  if (victoryMenuBtn) {
    victoryMenuBtn.addEventListener("click", returnToMainMenu);
  }

  const resetGameBtn = document.getElementById("reset-game-btn");
  if (resetGameBtn) {
    resetGameBtn.addEventListener("click", resetFullGame);
  }

  const skipSea2Btn = document.getElementById("skip-sea2-btn");
  if (skipSea2Btn) {
    skipSea2Btn.addEventListener("click", skipToSecondSea);
  }

  const skipKrakenBtn = document.getElementById("skip-kraken-btn");
  if (skipKrakenBtn) {
    skipKrakenBtn.addEventListener("click", skipToKrakenBoss);
  }
}

function gameLoop(timestamp) {
  if (!lastFrameTime) lastFrameTime = timestamp;
  const dt = Math.min((timestamp - lastFrameTime) / 1000, 0.05);
  lastFrameTime = timestamp;

  if (!lastSpawnTime) lastSpawnTime = timestamp;

  const baseWaterSpeed = currentSea === 2 ? SEA2_WATER_SCROLL_SPEED : WATER_SCROLL_SPEED;
  const waterSpeed = isPlaying() ? baseWaterSpeed : baseWaterSpeed * 0.35;
  waterOffsetY -= waterSpeed * dt;

  update(dt);
  drawFrame();
  requestAnimationFrame(gameLoop);
}

loadProgress();
applySelectedShip();
initUiClickSounds();
initMenuMusic();
initMenu();
initWaterTiles();
showMainMenu();
requestAnimationFrame(gameLoop);
