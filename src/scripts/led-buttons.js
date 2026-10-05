// <led-buttons a="happy" b="sad" editable></led-buttons>
// micro:bit の A・B ボタンをおすと、LED の絵が変わる部品。
//   - 「ボタン A が押されたとき」「ボタン B が押されたとき」に「アイコンを表示」を入れたときと同じ動き
//   - はじめは何も表示されない（どちらかのボタンをおすまで、実機も何も出ない）
//   - キーボードの A キー・B キーでもおせる
//   - editable を付けると、A と B で出す表情をえらべる
// 部品の中の文字は、どの学年でも読めるようにひらがなで書いている。
import { ICONS, FACE_NAMES } from '../lib/icons.js';

class LedButtons extends HTMLElement {
  connectedCallback() {
    if (this._ready) return;
    this._ready = true;
    this._icon = { a: this.getAttribute('a') || 'happy', b: this.getAttribute('b') || 'sad' };
    const editable = this.hasAttribute('editable');
    const options = (sel) => Object.entries(FACE_NAMES)
      .map(([k, v]) => `<option value="${k}"${k === sel ? ' selected' : ''}>${v}</option>`).join('');
    this.classList.add('ns');
    this.innerHTML = `
      <div class="ns-board lb-board">
        <button type="button" class="ns-btn ns-a lb-btn" data-btn="a" aria-label="ボタン A をおす"><span></span><b>A</b></button>
        <div class="ns-leds" role="img" aria-label="micro:bit の LED">${'<i></i>'.repeat(25)}</div>
        <button type="button" class="ns-btn ns-b lb-btn" data-btn="b" aria-label="ボタン B をおす"><span></span><b>B</b></button>
        <div class="ns-edge" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
      </div>
      <p class="lb-hint">A か B の ボタンを おしてみよう</p>
      ${editable ? `
      <div class="ns-controls">
        <label class="ns-label">A で だす かお<select class="lb-select" data-btn="a">${options(this._icon.a)}</select></label>
        <label class="ns-label">B で だす かお<select class="lb-select" data-btn="b">${options(this._icon.b)}</select></label>
      </div>` : ''}`;
    this._leds = [...this.querySelectorAll('.ns-leds i')];
    this._ledBox = this.querySelector('.ns-leds');
    this._hint = this.querySelector('.lb-hint');
    this.querySelectorAll('.lb-btn').forEach((btn) => {
      btn.addEventListener('click', () => this.press(btn.dataset.btn));
    });
    this.querySelectorAll('.lb-select').forEach((sel) => {
      sel.addEventListener('change', () => {
        this._icon[sel.dataset.btn] = sel.value;
        if (this._last === sel.dataset.btn) this.press(sel.dataset.btn);
      });
    });
    // 部品にフォーカスがあるとき、A キー・B キーでもおせる
    this.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'SELECT') return;
      const k = e.key.toLowerCase();
      if (k === 'a' || k === 'b') { e.preventDefault(); this.press(k); }
    });
  }

  press(which) {
    this._last = which;
    const name = this._icon[which];
    const pat = ICONS[name] || '';
    this._leds.forEach((led, i) => led.classList.toggle('on', pat[i] === '#'));
    this._ledBox.setAttribute('aria-label', `micro:bit の LED に「${FACE_NAMES[name] || name}」の かおが でている`);
    this._hint.textContent = `ボタン ${which.toUpperCase()} を おしたので「${FACE_NAMES[name] || name}」の かおが でたよ`;
    const btn = this.querySelector(`.lb-btn[data-btn="${which}"]`);
    btn.classList.add('pressed');
    setTimeout(() => btn.classList.remove('pressed'), 180);
  }
}

if (!customElements.get('led-buttons')) customElements.define('led-buttons', LedButtons);
