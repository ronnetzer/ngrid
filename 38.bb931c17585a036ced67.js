(window.webpackJsonp=window.webpackJsonp||[]).push([[38],{D0EO:function(e,t,c){"use strict";c.d(t,"a",(function(){return l}));var n=c("qFEQ"),r=c("GAih"),i=c("cc5W"),o=c("EM62");let l=(()=>{class e{}return e.\u0275mod=o.Qb({type:e}),e.\u0275inj=o.Pb({factory:function(t){return new(t||e)},imports:[[n.i,r.e,i.l],n.i,r.e,i.l]}),e})()},D57K:function(e,t,c){"use strict";function n(e,t,c,n){var r,i=arguments.length,o=i<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,c):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,c,n);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(o=(i<3?r(o):i>3?r(t,c,o):r(t,c))||o);return i>3&&o&&Object.defineProperty(t,c,o),o}c.d(t,"a",(function(){return n}))},gZI8:function(e,t,c){"use strict";c.r(t),c.d(t,"ColumnFilterExampleModule",(function(){return f}));var n=c("D57K"),r=c("2kYt"),i=c("XApm"),o=c("cc5W"),l=c("D0EO"),a=c("JRn2"),u=c("EM62"),s=c("qFEQ"),b=c("Ht9o");const p=Object(i.p)().default({minWidth:100}).table({prop:"id",width:"40px"},{prop:"name"},{prop:"gender",width:"50px"},{prop:"balance",width:"200px",filter:(e,t)=>t>e.min&&t<e.max}).build();let d=(()=>{let e=class{constructor(e){this.datasource=e,this.columns=p,this.ds=Object(i.q)().onTrigger(()=>this.datasource.getPeople(500)).create()}clearFilter(){this.ds.setFilter()}filterBalance(e){this.ds.hostGrid.setFilter(e?{min:Number.MIN_SAFE_INTEGER,max:0}:{min:0,max:Number.MAX_SAFE_INTEGER},["balance"])}};return e.\u0275fac=function(t){return new(t||e)(u.Sb(a.DemoDataSource))},e.\u0275cmp=u.Mb({type:e,selectors:[["pbl-column-filter-example"]],decls:11,vars:3,consts:[["fxLayout","row","fxLayoutGap","16px",2,"padding","8px"],["fxFlex","noshrink","mat-stroked-button","","color","primary",3,"click"],["fxFlex","*"],["blockUi","",3,"dataSource","columns"]],template:function(e,t){1&e&&(u.Yb(0,"div",0),u.Yb(1,"button",1),u.gc("click",(function(){return t.filterBalance(!0)})),u.Kc(2,"Balance: Negative"),u.Xb(),u.Yb(3,"button",1),u.gc("click",(function(){return t.filterBalance(!1)})),u.Kc(4,"Balance: Positive"),u.Xb(),u.Tb(5,"div",2),u.Yb(6,"button",1),u.gc("click",(function(){return t.clearFilter()})),u.Kc(7,"Clear Filter"),u.Xb(),u.Xb(),u.Tb(8,"pbl-ngrid",3),u.Yb(9,"div"),u.Kc(10),u.Xb()),2&e&&(u.Gb(8),u.rc("dataSource",t.ds)("columns",t.columns),u.Gb(2),u.Mc("Filtered Rows: ",t.ds.filteredData.length,""))},directives:[s.f,s.g,s.b,b.a],styles:[""],encapsulation:2,changeDetection:0}),e=Object(n.a)([Object(o.e)("pbl-column-filter-example",{title:"Column Filter"})],e),e})(),f=(()=>{let e=class{};return e.\u0275mod=u.Qb({type:e}),e.\u0275inj=u.Pb({factory:function(t){return new(t||e)},imports:[[r.c,l.a,i.i]]}),e=Object(n.a)([Object(o.a)(d)],e),e})()}}]);