(window.webpackJsonp=window.webpackJsonp||[]).push([[48],{D0EO:function(e,t,r){"use strict";r.d(t,"a",(function(){return a}));var n=r("qFEQ"),o=r("GAih"),c=r("cc5W"),i=r("EM62");let a=(()=>{class e{}return e.\u0275mod=i.Qb({type:e}),e.\u0275inj=i.Pb({factory:function(t){return new(t||e)},imports:[[n.i,o.e,c.l],n.i,o.e,c.l]}),e})()},D57K:function(e,t,r){"use strict";function n(e,t,r,n){var o,c=arguments.length,i=c<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,r,n);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(i=(c<3?o(i):c>3?o(t,r,i):o(t,r))||i);return c>3&&i&&Object.defineProperty(t,r,i),i}r.d(t,"a",(function(){return n}))},FHX5:function(e,t,r){"use strict";r.r(t),r.d(t,"RowOrderingExampleModule",(function(){return f}));var n=r("D57K"),o=r("XApm"),c=r("ykWx"),i=r("cc5W"),a=r("D0EO"),p=r("JRn2"),d=r("EM62"),l=r("Ht9o"),s=r("ZpNZ"),u=r("CWpx");let b=(()=>{let e=class{constructor(e){this.datasource=e,this.columns=Object(o.p)().table({prop:"drag_and_drop_handle",type:"drag_and_drop_handle",minWidth:24,width:"",maxWidth:24},{prop:"id",width:"100px"},{prop:"name",width:"100px"},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date",width:"25%"}).build(),this.ds=Object(o.q)().onTrigger(()=>this.datasource.getPeople(100,50)).create()}};return e.\u0275fac=function(t){return new(t||e)(d.Sb(p.DemoDataSource))},e.\u0275cmp=d.Mb({type:e,selectors:[["pbl-row-ordering-example"]],decls:1,vars:2,consts:[["rowReorder","","vScrollNone","","fallbackMinHeight","150",3,"dataSource","columns"]],template:function(e,t){1&e&&d.Tb(0,"pbl-ngrid",0),2&e&&d.rc("dataSource",t.ds)("columns",t.columns)},directives:[l.a,s.b,u.b],styles:[""],encapsulation:2,changeDetection:0}),e=Object(n.a)([Object(i.e)("pbl-row-ordering-example",{title:"Row Ordering"})],e),e})(),f=(()=>{let e=class{};return e.\u0275mod=d.Qb({type:e}),e.\u0275inj=d.Pb({factory:function(t){return new(t||e)},imports:[[a.a,o.i,c.a.withDefaultTemplates()]]}),e=Object(n.a)([Object(i.a)(b)],e),e})()}}]);