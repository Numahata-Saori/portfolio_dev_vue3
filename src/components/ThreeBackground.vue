<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { animate } from 'animejs'

// canvas tagを参照
const canvasRef = ref(null) // 初期値null

let scene, camera, renderer // scene:3D空間 camera:カメラ renderer:描画
let animationFrameId  // requestAnimationFrame()でループしているアニメーション処理ID
let rootGroup, armillaryGroup, particlesGroup
// let geometryGroup // THREE.Group 3Dオブジェクトを格納
let mouseX = 0 // マウスカーソル座標 X
let mouseY = 0 // マウスカーソル座標 Y
let targetX = 0
let targetY = 0

const windowHalfX = window.innerWidth / 2 // 画面表示領域 X方向の半値 ⇒ X方向の中央座標
const windowHalfY = window.innerHeight / 2 // 画面表示領域 Y方向の半値 ⇒ Y方向の中央座標

/**
 * マウス移動検知
 * @param event
 */
const handleMouseMove = (event) => {
  mouseX = (event.clientX - windowHalfX) * 0.0008
  mouseY = (event.clientY - windowHalfY) * 0.0008
  // event.clientX : 画面の左端からマウスカーソル現在のX座標
  // 0.001 : ラジアン単位の小さな値でスケーリング
}

/**
 * スクロールY軸読取り
 */
const handleScroll = () => {
  scrollY = window.scrollY
}

/**
 * リサイズ対応
 */
const handleResize = () => {
  if (!renderer || !camera) return // 初期化中や描画処理更新前にリサイズが発生した場合に中止
  camera.aspect = window.innerWidth / window.innerHeight // 画面のアスペクト比をカメラに更新
  camera.updateProjectionMatrix() // 投影行列を更新
  renderer.setSize(window.innerWidth, window.innerHeight) // 描画の解像度を更新
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // デバイスの解像度の最大値を2に制限
}

onMounted(() => {
  /**
   * シーン・カメラ・レンダラーの準備
   */
  scene = new THREE.Scene() // Three.jsでの3D空間を生成

  // 遠近感のある透視投影カメラを生成
  camera = new THREE.PerspectiveCamera(
    60, // 視野角
    window.innerWidth / window.innerHeight, // 画面比率
    0.1, // 最短描画距離
    1000 // 最長描画距離
  )
  camera.position.z = 32 // カメラ位置をZ方向プラス

  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value, // canvas要素を描画先に設定
    alpha: true, // 背景を透明にしてCSS背景と重ねる
    antialias: true, // ワイヤーフレームの斜め線のジャギーを滑らかにする
  })
  renderer.setSize(window.innerWidth, window.innerHeight) // 描画の解像度を更新
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // デバイスの解像度の最大値を2に制限

  // geometryGroup = new THREE.Group() // Three.jsで複数の3Dオブジェクトをまとめて1つの親グループを生成
  // scene.add(geometryGroup) // 3D空間を追加
  rootGroup = new THREE.Group()
  scene.add(rootGroup)

  /**
   * パーティクル
   */
  particlesGroup = new THREE.Group()
  rootGroup.add(particlesGroup)

  const particleCount = 220 // 空間に散りばめる粒子の数
  const positions = new Float32Array(particleCount * 3) // WebGLでパーティクルの3D座標を格納する32bit型付き配列を作成

  // ランダムに配置
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 90
    positions[i + 1] = (Math.random() - 0.5) * 90
    positions[i + 2] = (Math.random() - 0.5) * 70
  }

  const particleGeometry = new THREE.BufferGeometry() // BufferGeometryのインスタンスを生成
  // BufferGeometry に頂点属性を登録
  particleGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3) // 1つの頂点をXYZの3つの数値で表現
  )

  // パーティクルのマテリアルを作成
  const particleMaterial = new THREE.PointsMaterial({
    color: 0xfef08a,
    size: 0.75, // 点のサイズ
    transparent: true, // 半透明
    opacity: 0.55,
  })

  const starPoints = new THREE.Points(particleGeometry, particleMaterial) // パーティクルにオブジェクトとマテリアルを生成
  particlesGroup.add(starPoints) // パーティクルを追加

  /**
   * 天球儀
   */
  armillaryGroup = new THREE.Group()
  rootGroup.add(armillaryGroup)

  // 正二十面体
  const icosaGeo = new THREE.IcosahedronGeometry(11, 1) // 半径11 分割数1 の正二十面体を生成
  const icosaMat = new THREE.MeshBasicMaterial({
    color: 0xd4af37,
    wireframe: true, // 面を塗らず、稜線を描画
    transparent: true, // 半透明
    opacity: 0.32,
  })
  const icosaMesh = new THREE.Mesh(icosaGeo, icosaMat) // メッシュをに形状と質感を生成
  armillaryGroup.add(icosaMesh) // メッシュを追加

  // 天球儀リング生成関数
  const createBrassRing = (radius, color, opacity) => {
    const segments = 96 // 分割数
    const points = [] // 頂点座標を格納する配列

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2 // ステップに対応する角度
      points.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0)) // 円周上の座標を算出し配列に追加
    }

    // 頂点座標の配列をBufferGeometryに変換
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points)
    // ワイヤーフレーム専用のマテリアルを設定
    const lineMat = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: opacity,
    })
    return new THREE.Line(lineGeo, lineMat) // lineオブジェクトを生成
  }

  // 二重の同心円メインリング
  const ringMain = createBrassRing(15.8, 0xd4af37, 0.4) // 内周リングを生成
  const ringSub = createBrassRing(16.3, 0xf59e0b, 0.22) // 外周リングを生成
  armillaryGroup.add(ringMain) // 内周リングを追加
  armillaryGroup.add(ringSub) // 外周リングを追加

  // 角度目盛り（全48分割の精密ティックマーク）
  const tickCount = 48 // 目盛り総本数
  const tickPositions = [] // 目盛り線を格納する配列
  const baseInnerR = 15.8 // 目盛りの開始位置（内周リングに合わせる）

  for (let i = 0; i < tickCount; i++) {
    const angle = (i / tickCount) * Math.PI * 2 // 目盛りの角度
    const cos = Math.cos(angle) // 角度のcos
    const sin = Math.sin(angle) // 角度のsin

    let tickLength = 0.45 // 通常の目盛りの長さ
    // 12分割(90度)、4分割(30度)
    if (i % 12 === 0) {
      tickLength = 1.1 // 主要目盛りの長さ
    } else if (i % 4 === 0) {
      tickLength = 0.75 // 中間目盛りの長さ
    }

    // 内周半径に目盛りの長さを足して外周端の長さを決定
    const outerR = baseInnerR + tickLength
    // .pushで長さ判定し、通常の配列に格納
    tickPositions.push(cos * baseInnerR, sin * baseInnerR, 0) // 目盛り線の始点（内周）の座標
    tickPositions.push(cos * outerR, sin * outerR, 0) // 目盛り線の終点（外周）の座標
  }

  const tickGeo = new THREE.BufferGeometry() // BufferGeometryのインスタンスを生成
  // BufferGeometry に頂点属性を登録
  // 1つの頂点をXYZの3つの数値で表現, 通常の配列のためFloat32Arrayで自動変換
  tickGeo.setAttribute('position', new THREE.Float32BufferAttribute(tickPositions, 3))
  // 目盛り用の線マテリアルを設定
  const tickMat = new THREE.LineBasicMaterial({
    color: 0xfde047,
    transparent: true,
    opacity: 0.45,
  })
  const tickLines = new THREE.LineSegments(tickGeo, tickMat) // 目盛り線のオブジェクトを生成
  armillaryGroup.add(tickLines) // 目盛り線を追加

  // 直交補助リング
  const equatorRing = createBrassRing(17.2, 0xeab308, 0.2) // 少し大きめのリング
  equatorRing.rotation.x = Math.PI / 2 // X軸を中心に90度回転させて真横に倒す
  armillaryGroup.add(equatorRing) // 補助軸リングを追加

  /**
   * Anime.js を使った初期登場アニメーション（スケール展開）
   */
  armillaryGroup.scale.set(0.1, 0.1, 0.1)
  animate(armillaryGroup.scale, {
    x: 1,
    y: 1,
    z: 1,
    duration: 1800, // アニメーション時間
    ease: 'outExpo', // アニメーション速度
    loop: false
  })

  /**
   * アニメーションループ
   */
  let isPaused = false // 一時停止フラグoff
  // 一時停止エリア進入時に描画を止める
  window.addEventListener('toggle-three-pause', (e) => {
    const shouldPause = e.detail.pause
    if (isPaused && !shouldPause) {
      // 停止中から復帰する瞬間だけ、手動で tick を再点火してループを再開
      isPaused = false
      tick()
    } else {
      isPaused = shouldPause
    }
  })

  let baseRotX = 0
  let baseRotY = 0

  const tick = () => {
    if (isPaused) return // 一時停止中はレンダリングをスキップ

    // マウス慣性追従
    targetX += (mouseX - targetX) * 0.02
    targetY += (mouseY - targetY) * 0.02

    // 基本の自転速度
    baseRotX += 0.0003
    baseRotY += 0.0005

    // 天球儀の自転 ＋ マウス視差
    armillaryGroup.rotation.x = baseRotX + targetY * 0.25
    armillaryGroup.rotation.y = baseRotY + targetX * 0.25

    // リング目盛りの独立回転
    ringMain.rotation.z -= 0.0006
    tickLines.rotation.z -= 0.0006
    equatorRing.rotation.y += 0.0004

    // 星屑パーティクルのゆっくりとした浮遊自転
    particlesGroup.rotation.y += 0.00015
    particlesGroup.rotation.x -= 0.0001

    // スクロール連動：FVからスクロールすると天球儀が自然に上方へ退場
    const scrollOffset = scrollY * 0.035
    armillaryGroup.position.y = scrollOffset // スクロールに合わせて上へ抜ける

    // スクロール量に応じて天球儀の透明度を落とし、コンテンツの可読性を確保
    const opacityFactor = Math.max(0, 1 - scrollY / 700)
    icosaMat.opacity = 0.32 * opacityFactor
    ringMain.material.opacity = 0.4 * opacityFactor
    tickMat.opacity = 0.45 * opacityFactor

    renderer.render(scene, camera) // 設定したカメラ視点から画面に描画

    animationFrameId = requestAnimationFrame(tick) // 画面更新タイミングに合わせて次の更新直前にtickを実行
  }
  tick()

  // イベントリスナー登録
  window.addEventListener('resize', handleResize)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('scroll', handleScroll)
})

// コンポーネント破棄時のメモリ解放（実務必須のクリーンアップ処理）
onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrameId) // アニメーションを停止

  // イベントリスナーを削除
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('scroll', handleScroll)

  if (renderer) {
    renderer.dispose() // レンダラーを解放
  }
  if (scene) {
    scene.clear() // シーン内全オブジェクトを削除
  }
})
</script>

<template>
  <canvas ref="canvasRef" class="webgl-canvas"></canvas>
</template>

<style scoped>
.webgl-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  /* z-index: -1; */
  z-index: 0;
  pointer-events: none;
}
</style>