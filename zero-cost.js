'use strict';

const reportViews = {
  vendor: {panel:'vendor-report', title:'병원 AI 상담 도입 사례와 뷰티블라썸 자체 운영 방안', top:'top', nav:[['case','실제 활용 사례'],['code','쉬운 코드 분석'],['vendor','참고 기술 자료'],['cost','유료 비용 참고'],['integration','구현 방식'],['decision','사례에서 배울 점']]},
  zero: {panel:'zero-report', title:'뷰티블라썸 제로코스트 적용안 | 홈페이지 AI 상담 도입 검토', top:'zc-top', nav:[['zc-system','시스템 구성'],['zc-model','로컬 AI 선택'],['zc-imweb','아임웹 연결'],['zc-data','DB와 직원 업무'],['zc-cost','비용 검토'],['zc-plan','도입 순서']]}
};
const reportTabs = [...document.querySelectorAll('[data-report]')];
const reportNavigation = document.querySelector('.report-navigation');
const sectionLinks = [...document.querySelectorAll('.section-nav a')];

function selectReport(name, focusTab = false, preserveAnchor = false) {
  const view = reportViews[name];
  if (!view) return;
  const openDialog = document.querySelector('dialog[open]');
  if (openDialog) openDialog.close();
  reportTabs.forEach(tab => {
    const selected = tab.dataset.report === name;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  Object.entries(reportViews).forEach(([key, item]) => {
    const panel = document.getElementById(item.panel);
    panel.hidden = key !== name;
    panel.classList.remove('is-entering');
  });
  document.getElementById(view.panel).classList.add('is-entering');
  view.nav.forEach(([id, label], index) => {
    sectionLinks[index].href = `#${id}`;
    sectionLinks[index].textContent = label;
  });
  reportNavigation.dataset.activeReport = name;
  document.querySelector('[data-report-top]').href = `#${view.top}`;
  document.title = view.title;
  // Both reports stay at the same public URL; no route, query or tab hash is added.
  if (location.hash && !preserveAnchor) history.replaceState(null, '', location.pathname + location.search);
  const previousScrollStyle = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = 'auto';
  if (!preserveAnchor) window.scrollTo(0, 0);
  document.documentElement.style.scrollBehavior = previousScrollStyle;
  if (focusTab) reportTabs.find(tab => tab.dataset.report === name).focus({preventScroll:true});
}

reportTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectReport(tab.dataset.report));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % reportTabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + reportTabs.length) % reportTabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = reportTabs.length - 1;
    else return;
    event.preventDefault();
    selectReport(reportTabs[next].dataset.report, true);
  });
});
document.querySelectorAll('[data-open-report]').forEach(button => button.addEventListener('click', event => {
  event.preventDefault();
  selectReport(button.dataset.openReport, true);
}));

const updateScrollPadding = () => {
  document.documentElement.style.scrollPaddingTop = `${Math.ceil(reportNavigation.getBoundingClientRect().height) + 18}px`;
};
if (typeof ResizeObserver !== 'undefined') new ResizeObserver(updateScrollPadding).observe(reportNavigation);
else window.addEventListener('resize', updateScrollPadding);
updateScrollPadding();

function showAnchorReport() {
  const target = document.getElementById(location.hash.slice(1));
  const panel = target?.closest('.report-panel');
  if (!panel) return;
  const name = Object.keys(reportViews).find(key => reportViews[key].panel === panel.id);
  if (panel.hidden) selectReport(name, false, true);
  requestAnimationFrame(() => target.scrollIntoView({behavior:'instant', block:'start'}));
}
window.addEventListener('hashchange', showAnchorReport);
showAnchorReport();

const zeroNodes = {
  website:{title:'고객은 기존 홈페이지에서 상담을 시작합니다.',text:'아임웹에 채팅창을 표시하는 코드를 넣습니다. 홈페이지에는 질문을 입력하고 답변을 읽는 화면을 두고, AI 계산과 기록 저장은 자체 서버에서 처리합니다.'},
  server:{title:'자체 상담 서버가 문의와 기록을 처리합니다.',text:'질문에 필요한 병원 자료를 찾고 AI에 전달합니다. 답변을 고객에게 보여주고 접수 기록을 저장하며, 직원용 목록 전송은 고객 응답과 나누어 처리하는 구성을 제안합니다.'},
  model:{title:'우리 장비에서 실행하는 AI가 답변을 작성합니다.',text:'GLM·DeepSeek 등 공개 모델 중 우리 장비에 맞는 후보를 비교합니다. 승인된 병원 자료를 제공하고, 자료에 없는 질문은 직원 상담으로 연결하도록 설계해야 합니다.'},
  database:{title:'데이터베이스는 원본 상담 기록을 보관합니다.',text:'전체 대화와 접수번호·연락처 등을 저장합니다. PostgreSQL을 자체 운영하는 방안을 검토할 수 있으며, 직원은 별도 목록을 이용하고 원본의 백업·복구는 관리자가 담당합니다.'},
  sheet:{title:'직원은 필요한 접수 정보만 확인합니다.',text:'스프레드시트에 상담 요약·담당자·처리 상태와 메모를 표시합니다. 처음에는 DB에서 시트로 전달하는 흐름을 제안합니다. 직원의 상태 변경을 DB에도 반영할지는 별도로 설계해야 합니다.'}
};
document.querySelectorAll('[data-zc-node]').forEach(button => button.addEventListener('click', () => {
  const item = zeroNodes[button.dataset.zcNode];
  if (!item) return;
  document.querySelectorAll('[data-zc-node]').forEach(node => {
    const selected = node === button;
    node.classList.toggle('selected', selected);
    node.setAttribute('aria-pressed', String(selected));
  });
  const detail = document.getElementById('zc-node-detail');
  detail.querySelector('h3').textContent = item.title;
  detail.querySelector('p').textContent = item.text;
}));
