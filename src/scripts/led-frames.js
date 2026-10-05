// <led-frames frames="heart small-heart" pause="500" editable></led-frames>
// micro:bit の LED に絵を順番に表示して、アニメーションを見せる部品。
//   - 「ずっと」の中で「アイコンを表示」と「一時停止」をくり返したときと同じ速さで切り替わる
//     （1枚の時間 = アイコンを表示の 600 ミリ秒 + 一時停止の時間）
//   - editable を付けると、一時停止の時間を変えて、速さのちがいを試せる
// 部品の中の文字は、どの学年でも読めるようにひらがなで書いている。
import { ICONS, SHOW_ICON_MS } from '../lib/icons.js';

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

class LedFrames extends HTMLElement {
  connectedCallback() {
    if (!this._ready) this._build();
    if (!reduceMotion() || this._userStarted) this.play();
    else this._render(0);
  }

  disconnectedCallback() {
    this.stop();
  }

  _build() {
    this._ready = true;
    this._frames = (this.getAttribute('frames') || 'heart small-heart').split(/\s+/).filter((n) => ICONS[n]);
    this._pause = Number(this.getAttribute('pause') ?? 500);
    const editable = this.hasAttribute('editable');
    this.classList.add('ns');
    this.innerHTML = `
      <div class="ns-board" role="img" aria-label="micro:bit の LED で絵が切りかわっているところ">
        <div class="ns-btn ns-a" aria-hidden="true"><span></span><b>A</b></div>
        <div class="ns-leds" aria-hidden="true">${'<i></i>'.repeat(25)}</div>
        <div class="ns-btn ns-b" aria-hidden="true"><span></span><b>B</b></div>
        <div class="ns-edge" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
      </div>
      <div class="ns-controls">
        ${editable ? `
        <label class="ns-label">いちじていし（ミリびょう）：<output class="lf-value">${this._pause}</output>
          <input class="lf-range" type="range" min="0" max="2000" step="100" value="${this._pause}">
        </label>` : ''}
        <button class="ns-toggle" type="button"></button>
      </div>
      ${editable ? '<p class="lf-note" aria-live="polite"></p>' : ''}`;
    this._leds = [...this.querySelectorAll('.ns-leds i')];
    this._toggle = this.querySelector('.ns-toggle');
    this._range = this.querySelector('.lf-range');
    this._value = this.querySelector('.lf-value');
    this._note = this.querySelector('.lf-note');
    this._toggle.addEventListener('click', () => {
      this._userStarted = true;
      this._timer ? this.stop() : this.play();
    });
    this._range?.addEventListener('input', () => {
      this._pause = Number(this._range.value);
      this._value.textContent = String(this._pause);
      this._updateNote();
      if (this._timer) this.play();
    });
    this._index = 0;
    this._updateNote();
  }

  _updateNote() {
    if (!this._note) return;
    const per = SHOW_ICON_MS + this._pause;
    const perMin = Math.round(60000 / (per * this._frames.length));
    this._note.textContent = `1まいの えを ${(per / 1000).toFixed(1)}びょう みせるよ。1ぷんに やく ${perMin}かい ドキドキするよ。`;
  }

  _render(i) {
    const pat = ICONS[this._frames[i]] || '';
    this._leds.forEach((led, k) => led.classList.toggle('on', pat[k] === '#'));
  }

  play() {
    this.stop();
    const tick = () => {
      this._render(this._index);
      this._index = (this._index + 1) % this._frames.length;
      this._timer = setTimeout(tick, SHOW_ICON_MS + this._pause);
    };
    tick();
    this._toggle.textContent = '■ とめる';
    this._toggle.setAttribute('aria-pressed', 'true');
  }

  stop() {
    clearTimeout(this._timer);
    this._timer = null;
    if (this._toggle) {
      this._toggle.textContent = '▶ うごかす';
      this._toggle.setAttribute('aria-pressed', 'false');
    }
  }
}

if (!customElements.get('led-frames')) customElements.define('led-frames', LedFrames);
