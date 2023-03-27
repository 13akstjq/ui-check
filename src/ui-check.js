import './style.scss';

const CustomElement = require('./custom-element.js');

class UiCheck {
    constructor(options = {}) {
        const { position = 'bottom right' } = options;
        UiCheck.count = UiCheck.count === undefined ? 1 : UiCheck.count+1;

        this.buttonCount = 0;
        this.pointColor = '#3bca03';
        this.uiCheckEl = document.createElement('div');
        this.uiCheckEl.id = `_ui_check${UiCheck.count}`;
        this.uiCheckEl.className = `_ui_check_area off ${position}`;
        this.uiCheckEl.style.transform = `translate(0px, 0px)`;
        this.x = 0;
        this.y = 0;
        this.point

        this.uiCheckEl.innerHTML = `
            <h6 class="_ui_heading">UI확인 버튼</h6>
            <div class="_ui_button_area"></div>
        `;

        document.querySelector('body').appendChild(this.uiCheckEl);
        this.initEvents();
    }

    moving() {
        let clicked = false;
        let lastX = null;
        let lastY = null;

        const targetEl2 = new CustomElement(document.querySelector('html'));

        const moveInit = (e) => {
            clicked =  true;
            lastX = lastY = undefined;
        };

        const move = (x, y) => {
            if(lastX && lastY) {
                this.x += x - lastX;
                this.y += y - lastY;
            }

            lastX = x;
            lastY = y;

            this.uiCheckEl.style.transform = `translate(${Math.floor(this.x)}px, ${Math.floor(this.y)}px)`;
        };

        targetEl2.addEventsListener(['mousedown', 'touchstart'], (e) => {
            if(!this.uiCheckEl.querySelector(`.${e.target.classList[0]}`)) return;
            moveInit(e);
        }).addEventsListener(['mouseup', 'touchend'], (e) => {
            clicked = false;
        }).addEventListener('mousemove', (e) => {
            if(clicked) {
                move(e.clientX, e.clientY);
            }
        }).addEventListener('touchmove', (e) => {
            if(clicked) {
                const touchInfo = e.touches[0] || e.changedTouches[0]
                move(touchInfo.clientX, touchInfo.clientY);
            }
        });
    }

    onOff() {
        const buttonEl = document.createElement('button');
        buttonEl.type = 'button';
        buttonEl.className = '_ui_close_button';
        buttonEl.innerHTML = `<span class="_ui_blind">close</span><svg class="_ui_onoff_icon" viewBox="0 0 193.5 116">
        <circle class="eye pupil pupil--close pupil--open" cx="96.8" cy="58" r="24"></circle>
        <path class="eye lid lid--close lid--open" d="M5,58L5,58C23.4,26.3,57.6,5,96.8,5c39.3,0,73.8,21.3,91.8,53l0,0c0,0-26.7,53-91.8,53S5,58,5,58z"></path>
        </svg>`;
        buttonEl.addEventListener('click', (e) => {
            this.uiCheckEl.classList.toggle('hide');
        });
        this.uiCheckEl.appendChild(buttonEl);

        return this;
    }

    initEvents() {
        this.moving();
        this.onOff();
    }

    createButton(name) {
        this.uiCheckEl.classList.remove('off');
        const buttonEl = document.createElement('button');
        this.buttonCount++;

        buttonEl.type = 'button';
        buttonEl.className = "_ui_button";
        name && (buttonEl.innerHTML = `<span class="_ui_button_name">${name}</span>`);

        return buttonEl;
    }

    add(item) {
        const { name, handler, type = 'default', step } = item;
        const checkButtonEl = this.createButton(name);
        var param = undefined;

        if( step !== undefined ) {
            const rate = Math.floor( 1 / step * 100);
            checkButtonEl.classList.add('-step');
            param = 1;
            checkButtonEl.querySelector('._ui_button_name').style.background 
                = `linear-gradient(to right, ${this.pointColor}, ${this.pointColor} ${rate}%, rgba(0,0,0,0) ${rate}%, rgba(0,0,0,0))`;
        }

        checkButtonEl.addEventListener('click', () => {
            if(type === 'toggle') {
                param = !!(checkButtonEl.style.background = checkButtonEl.style.background ? '' : this.pointColor);
            }

            if(type === 'once') {
                setTimeout(() => {
                    checkButtonEl.disabled = true;
                }, 0)
            }

            if(step !== undefined) {
                if(param === step) 
                    param = 0;

                const rate = Math.floor( (++param) / (step) * 100);
                const bg = `linear-gradient(to right, ${this.pointColor}, ${this.pointColor} ${rate}%, rgba(0,0,0,0) ${rate}%, rgba(0,0,0,0))`;
                checkButtonEl.querySelector('._ui_button_name').style.background = bg;
            }

            handler(param, step);
        });
        this.uiCheckEl.querySelector('._ui_button_area').appendChild(checkButtonEl);

        return this;
    }

    group(items, defaultIndex) {
        const groupEl = document.createElement('div');
        let selectedEl = null;
        groupEl.className = '_ui_button_group';

        items.forEach((item, index) => {
            const checkButtonEl = this.createButton(item.name);

            if(defaultIndex === index) {
                selectedEl = checkButtonEl;
                checkButtonEl.style.background = this.pointColor;
                item.handler();
            }

            checkButtonEl.addEventListener('click', item.handler);
            groupEl.appendChild(checkButtonEl);
        });

        groupEl.addEventListener('click', ({target}) => {
            if(target.classList[0] === '_ui_button') {
                selectedEl && (selectedEl.style.background = '');
                target.style.background = this.pointColor;
                selectedEl = target;
            }
        });

        this.uiCheckEl.querySelector('._ui_button_area').appendChild(groupEl);

        return this;
    }
}

window.UiCheck = UiCheck;
