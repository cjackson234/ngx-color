import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { isValidHex, HSLA, RGBA } from 'ngx-color';

@Component({
  selector: 'color-sketch-fields',
  template: `
  <div class="sketch-fields sketch-hex">
    <div class="sketch-double">
      <color-editable-input class="test"
        [style]="{ input: input, label: label }"
        [value]="hex"
        (onChange)="handleChange($event)"
      ></color-editable-input>
    </div>
    <div class="sketch-single" [hidden]="showRGB">
      <color-editable-input
        [style]="{ input: input, label: label }"
        label="r"
        [value]="rgb.r"
        (onChange)="handleChange($event)"
        [dragLabel]="true"
        [dragMax]="255"
      ></color-editable-input>
    </div>
    <div class="sketch-single" [hidden]="showRGB">
      <color-editable-input
        [style]="{ input: input, label: label }"
        label="g"
        [value]="rgb.g"
        (onChange)="handleChange($event)"
        [dragLabel]="true"
        [dragMax]="255"
      ></color-editable-input>
    </div>
    <div class="sketch-single" [hidden]="showRGB">
      <color-editable-input
        [style]="{ input: input, label: label }"
        label="b"
        [value]="rgb.b"
        (onChange)="handleChange($event)"
        [dragLabel]="true"
        [dragMax]="255"
      ></color-editable-input>
    </div>
    <div class="sketch-alpha" [hidden]="showRGB" *ngIf="disableAlpha === false">
      <color-editable-input
        [style]="{ input: input, label: label }"
        label="a"
        [value]="round(rgb.a * 100)"
        (onChange)="handleChange($event)"
        [dragLabel]="true"
        [dragMax]="100"
      ></color-editable-input>
    </div>
  </div>
  `,
  styles: [
    `
    .sketch-fields {
      display: flex;
      padding-top: 4px;
    }
    .sketch-double {
      -webkit-box-flex: 2;
      flex: 2 1 0%;
    }
    .sketch-single {
      flex: 1 1 0%;
      padding-left: 6px;
    }
    .sketch-alpha {
      -webkit-box-flex: 1;
      flex: 1 1 0%;
      padding-left: 6px;
    }
    .sketch-hex{
      width: 120px;
      left: 40px;
      position: relative;
    }

    .test input[type="text"]{
      font-size: 12px;
      color: rgb(102, 102, 102);
      border: 0px;
      outline: none;
      height: 22px;
      box-shadow: rgb(221, 221, 221) 0px 0px 0px 1px inset;
      border-radius: 4px;
      padding: 0px 7px;
      box-sizing: border-box;
    }
  `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
})
export class SketchFieldsComponent {
  @Input() hsl: HSLA;
  @Input() rgb: RGBA;
  @Input() hex: string;
  @Input() disableAlpha = false;
  @Input() showRGB = false;
  @Output() onChange = new EventEmitter<any>();
  input: {[key: string]: string} = {
    width: '100%',
    fontSize: '12px',
    color: '#666',
    border: '0px',
    outline: 'none',
    height: '22px',
    boxShadow: 'inset 0 0 0 1px #ddd',
    borderRadius: '4px',
    padding: '0 7px',
    boxSizing: 'border-box',
    marginBottom: '10px'
  };
  label: {[key: string]: string} = {
    display: 'block',
    textAlign: 'center',
    fontSize: '11px',
    color: '#222',
    paddingTop: '3px',
    paddingBottom: '4px',
    textTransform: 'capitalize',
  };

  round(value) {
    return Math.round(value);
  }
  handleChange({ data, $event }) {
    if (data.hex) {
      if (isValidHex(data.hex)) {
        console.log
        this.onChange.emit({
          data: {
            hex: data.hex,
            source: 'hex',
          },
          $event,
        });
      }
    } else if (data.r || data.g || data.b) {
      this.onChange.emit({
        data: {
          r: data.r || this.rgb.r,
          g: data.g || this.rgb.g,
          b: data.b || this.rgb.b,
          source: 'rgb',
        },
        $event,
      });
    } else if (data.a) {
      if (data.a < 0) {
        data.a = 0;
      } else if (data.a > 100) {
        data.a = 100;
      }
      data.a /= 100;

      this.onChange.emit({
        data: {
          h: this.hsl.h,
          s: this.hsl.s,
          l: this.hsl.l,
          a: Math.round(data.a * 100) / 100,
          source: 'rgb',
        },
        $event,
      });
    } else if (data.h || data.s || data.l) {
      this.onChange.emit({
        data: {
          h: data.h || this.hsl.h,
          s: Number((data.s && data.s) || this.hsl.s),
          l: Number((data.l && data.l) || this.hsl.l),
          source: 'hsl',
        },
        $event,
      });
    }
  }
}
