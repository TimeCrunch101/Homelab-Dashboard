import{q as c,d as l,l as n,b as d,o as r,c as u,a as t,t as o,F as i}from"./index.42b96c12.js";const m=t("div",{class:"contain"},[t("section",{id:"doc-body",class:"mt-2"})],-1),h={__name:"PubDocView",setup(_){const s=c(),e=l({});return n(()=>{d.get(`/api/get/published/doc/${s.params.doc_id}`).then(a=>{e.value=a.data.docs,document.getElementById("doc-body").innerHTML=e.value.doc_html}).catch(a=>{console.error(a)})}),(a,p)=>(r(),u(i,null,[t("h1",null,o(e.value.doc_title),1),t("p",null,"Related Service: "+o(e.value.related_service),1),t("p",null,"Created: "+o(e.value.timestamp),1),m],64))}};export{h as default};