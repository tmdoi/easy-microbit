// 課題の一覧（順路の順）。ready: true のものだけ、このサイトに案内ページがあります。
// 出典: microbit.org「First lessons with MakeCode and the micro:bit」
export const lessons = [
  {
    id: 'name-badge', ready: true, minutes: 30,
    title: '名前バッジを作ろう',
    summary: '自分の名前を流して表示する、はじめてのプログラム。',
    official: 'https://microbit.org/teach/lessons/name-badge/',
    led: '.###.#...#######...##...#',
  },
  {
    id: 'beating-heart', ready: true, minutes: 30,
    title: 'ドキドキハート',
    summary: '絵を順番に表示して、アニメーションを作る。',
    official: 'https://microbit.org/teach/lessons/beating-heart/',
    led: '.#.#.##########.###...#..',
  },
  {
    id: 'emotion-badge', ready: true, minutes: 30,
    title: '気持ちバッジ',
    summary: 'ボタンを押すと、顔の表情が変わる。',
    official: 'https://microbit.org/teach/lessons/emotion-badge/',
    led: '......#.#......#...#.###.',
  },
  {
    id: 'step-counter', ready: false, minutes: 45,
    title: '歩数計',
    summary: 'ゆれを感じるセンサーで、歩いた数を数える。',
    official: 'https://microbit.org/teach/lessons/step-counter/',
    led: '..#...##....#....#...###.',
  },
  {
    id: 'nightlight', ready: false, minutes: 45,
    title: '夜のライト',
    summary: '暗くなると自動でつくライトを作る。',
    official: 'https://microbit.org/teach/lessons/nightlight/',
    led: '.###.##...#....##....###.',
  },
  {
    id: 'rock-paper-scissors', ready: false, minutes: 45,
    title: 'じゃんけん',
    summary: 'ふると、グー・チョキ・パーのどれかが出る。',
    official: 'https://microbit.org/teach/lessons/rock-paper-scissors/',
    led: '##..###.#...#..##.#.##..#',
  },
];
