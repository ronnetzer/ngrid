(window.webpackJsonp=window.webpackJsonp||[]).push([[26],{"4hZz":function(t,e,c){"use strict";c.r(e),c.d(e,"VirtualScrollExampleModule",(function(){return y}));var o=c("D57K"),r=c("2kYt"),i=c("F1o0"),s=c("XApm"),n=c("WNo/"),l=c("cc5W"),a=c("D0EO"),u=c("JRn2"),b=c("EM62"),d=c("Ht9o"),p=c("R3BP"),h=c("CWpx");function g(t,e){if(1&t&&b.Tb(0,"pbl-ngrid",11),2&t){const t=b.kc(2);b.rc("dataSource",t.ds)("columns",t.columns)}}function f(t,e){if(1&t&&b.Tb(0,"pbl-ngrid",12),2&t){const t=b.kc(2);b.rc("dataSource",t.ds)("columns",t.columns)}}function m(t,e){if(1&t&&b.Tb(0,"pbl-ngrid",13),2&t){const t=b.kc(2);b.rc("dataSource",t.ds)("columns",t.columns)}}function k(t,e){if(1&t&&(b.Wb(0,7),b.Ic(1,g,1,2,"pbl-ngrid",8),b.Ic(2,f,1,2,"pbl-ngrid",9),b.Ic(3,m,1,2,"pbl-ngrid",10),b.Vb()),2&t){b.kc();const t=b.wc(1);b.rc("ngSwitch",t.value),b.Gb(1),b.rc("ngSwitchCase","auto"),b.Gb(1),b.rc("ngSwitchCase","fixed"),b.Gb(1),b.rc("ngSwitchCase","none")}}let S=(()=>{let t=class{constructor(t){this.datasource=t,this.columns=Object(s.p)().default({minWidth:100}).table({prop:"id",sort:!0,width:"40px"},{prop:"name",sort:!0},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date"}).build(),this.ds=this.createDatasource()}removeDatasource(){this.ds&&(this.ds.dispose(),this.ds=void 0)}createDatasource(){return Object(s.q)().onTrigger(()=>this.datasource.getPeople(0,1500)).create()}};return t.\u0275fac=function(e){return new(e||t)(b.Sb(u.DemoDataSource))},t.\u0275cmp=b.Mb({type:t,selectors:[["pbl-virtual-scroll-example"]],decls:11,vars:2,consts:[["value","auto",3,"change"],["rdGroup","matRadioGroup"],["value","auto"],["value","fixed"],["value","none"],[3,"ngSwitch",4,"ngIf"],["mat-button","",3,"disabled","click"],[3,"ngSwitch"],["blockUi","","vScrollAuto","",3,"dataSource","columns",4,"ngSwitchCase"],["blockUi","","vScrollFixed","48",3,"dataSource","columns",4,"ngSwitchCase"],["blockUi","","vScrollNone","",3,"dataSource","columns",4,"ngSwitchCase"],["blockUi","","vScrollAuto","",3,"dataSource","columns"],["blockUi","","vScrollFixed","48",3,"dataSource","columns"],["blockUi","","vScrollNone","",3,"dataSource","columns"]],template:function(t,e){1&t&&(b.Yb(0,"mat-radio-group",0,1),b.gc("change",(function(){return e.removeDatasource()})),b.Yb(2,"mat-radio-button",2),b.Kc(3,"Auto Size"),b.Xb(),b.Yb(4,"mat-radio-button",3),b.Kc(5,"Fixed Size"),b.Xb(),b.Yb(6,"mat-radio-button",4),b.Kc(7,"No Virtual Scroll"),b.Xb(),b.Xb(),b.Ic(8,k,4,4,"ng-container",5),b.Yb(9,"button",6),b.gc("click",(function(){return e.ds=e.createDatasource()})),b.Kc(10,"Load Data"),b.Xb()),2&t&&(b.Gb(8),b.rc("ngIf",e.ds),b.Gb(1),b.rc("disabled",e.ds))},directives:[i.b,i.a,r.t,r.x,r.y,d.a,p.b,h.b],styles:[""],encapsulation:2,changeDetection:0}),t=Object(o.a)([Object(l.e)("pbl-virtual-scroll-example",{title:"Virtual Scroll"})],t),t})();var v=c("16RR");let w=(()=>{let t=class{constructor(t){this.datasource=t,this.columns=Object(s.p)().default({minWidth:100}).table({prop:"id",sort:!0,width:"40px"},{prop:"name",sort:!0},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date"}).build(),this.ds=this.createDatasource(),this.isScrolling=0}createDatasource(){return Object(s.q)().onTrigger(()=>this.datasource.getPeople(0,1500)).create()}};return t.\u0275fac=function(e){return new(e||t)(b.Sb(u.DemoDataSource))},t.\u0275cmp=b.Mb({type:t,selectors:[["pbl-scrolling-state-example"]],decls:12,vars:4,consts:[[3,"dataSource","columns","scrolling"],[1,"virtual-scroll-css-scrolling-demo-on"],[1,"virtual-scroll-css-scrolling-demo-off"]],template:function(t,e){1&t&&(b.Yb(0,"pbl-ngrid",0),b.gc("scrolling",(function(t){return e.isScrolling=t})),b.Xb(),b.Yb(1,"h1"),b.Kc(2,"Scrolling is "),b.Yb(3,"span",1),b.Kc(4,"ON"),b.Xb(),b.Yb(5,"span",2),b.Kc(6,"OFF"),b.Xb(),b.Kc(7," - (CSS)"),b.Xb(),b.Yb(8,"h1"),b.Kc(9),b.Xb(),b.Yb(10,"h1"),b.Kc(11),b.Xb()),2&t&&(b.rc("dataSource",e.ds)("columns",e.columns),b.Gb(9),b.Mc("Scrolling is ",e.isScrolling?"ON":"OFF"," - (scrolling) event"),b.Gb(2),b.Mc("Last Scrolling Direction: ",1===e.isScrolling?"END":"START",""))},directives:[d.a,v.a],styles:["pbl-ngrid+h1 .virtual-scroll-css-scrolling-demo-on{display:none}.pbl-ngrid.pbl-ngrid-scrolling+h1 .virtual-scroll-css-scrolling-demo-on{display:inline}.pbl-ngrid.pbl-ngrid-scrolling+h1 .virtual-scroll-css-scrolling-demo-off{display:none}"],encapsulation:2,changeDetection:0}),t=Object(o.a)([Object(l.e)("pbl-scrolling-state-example",{title:"Scrolling State"})],t),t})(),y=(()=>{let t=class{};return t.\u0275mod=b.Qb({type:t}),t.\u0275inj=b.Pb({factory:function(e){return new(e||t)},imports:[[r.c,i.c,a.a,s.i,n.a]]}),t=Object(o.a)([Object(l.a)(S,w)],t),t})()},D0EO:function(t,e,c){"use strict";c.d(e,"a",(function(){return n}));var o=c("qFEQ"),r=c("GAih"),i=c("cc5W"),s=c("EM62");let n=(()=>{class t{}return t.\u0275mod=s.Qb({type:t}),t.\u0275inj=s.Pb({factory:function(e){return new(e||t)},imports:[[o.i,r.e,i.l],o.i,r.e,i.l]}),t})()},D57K:function(t,e,c){"use strict";function o(t,e,c,o){var r,i=arguments.length,s=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,c):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,c,o);else for(var n=t.length-1;n>=0;n--)(r=t[n])&&(s=(i<3?r(s):i>3?r(e,c,s):r(e,c))||s);return i>3&&s&&Object.defineProperty(e,c,s),s}c.d(e,"a",(function(){return o}))},R3BP:function(t,e,c){"use strict";c.d(e,"a",(function(){return n})),c.d(e,"b",(function(){return l}));var o=c("9bRT"),r=c("5XID"),i=c("XApm"),s=c("EM62");const n="blockUi";let l=(()=>{class t{constructor(t,e){this.grid=t,this._blockInProgress=!1,this._removePlugin=e.setPlugin(n,this),t.registry.changes.subscribe(t=>{for(const e of t)switch(e.type){case"blocker":this.setupBlocker()}}),e.events.subscribe(t=>{if("onDataSource"===t.kind){const{prev:e,curr:c}=t;e&&i.u.unrx.kill(this,e),c.onSourceChanging.pipe(i.u.unrx(this,c)).subscribe(()=>{"auto"===this._blockUi&&(this._blockInProgress=!0,this.setupBlocker())}),c.onSourceChanged.pipe(i.u.unrx(this,c)).subscribe(()=>{"auto"===this._blockUi&&(this._blockInProgress=!1,this.setupBlocker())})}})}get blockUi(){return this._blockUi}set blockUi(t){let e=Object(r.c)(t);!e||"auto"!==t&&""!==t||(e="auto"),Object(o.a)(t)&&this._blockUi!==t?(Object(o.a)(this._blockUi)&&i.u.unrx.kill(this,this._blockUi),this._blockUi=t,t.pipe(i.u.unrx(this,this._blockUi)).subscribe(t=>{this._blockInProgress=t,this.setupBlocker()})):this._blockUi!==e&&(this._blockUi=e,"auto"!==e&&(this._blockInProgress=e,this.setupBlocker()))}ngOnDestroy(){i.u.unrx.kill(this),this._removePlugin(this.grid)}setupBlocker(){if(this._blockInProgress){if(!this._blockerEmbeddedVRef){const t=this.grid.registry.getSingle("blocker");t&&(this._blockerEmbeddedVRef=this.grid.createView("afterContent",t.tRef,{$implicit:this.grid}),this._blockerEmbeddedVRef.detectChanges())}}else this._blockerEmbeddedVRef&&(this.grid.removeView(this._blockerEmbeddedVRef,"afterContent"),this._blockerEmbeddedVRef=void 0)}}return t.\u0275fac=function(e){return new(e||t)(s.Sb(i.e),s.Sb(i.l))},t.\u0275dir=s.Nb({type:t,selectors:[["pbl-ngrid","blockUi",""]],inputs:{blockUi:"blockUi"},exportAs:["blockUi"]}),t})()},"WNo/":function(t,e,c){"use strict";c.d(e,"a",(function(){return l}));var o=c("2kYt"),r=c("fL1z"),i=c("XApm"),s=c("R3BP"),n=c("EM62");let l=(()=>{class t{}return t.NGRID_PLUGIN=Object(i.s)({id:s.a},s.b),t.\u0275mod=n.Qb({type:t}),t.\u0275inj=n.Pb({factory:function(e){return new(e||t)},imports:[[o.c,r.s,i.i]]}),t})()}}]);