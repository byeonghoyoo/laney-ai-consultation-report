'use strict';

const byId = id => document.getElementById(id);

const shots = {
  live: {src:'assets/yonseistar-live-chat.png', alt:'연세스타피부과의 실제 상담 시작 화면', title:'처음 문의하는 고객의 진입 장벽을 낮춥니다.', description:'운영시간, 흉터 치료, 예약, 오시는 길 등 질문 버튼을 보여줍니다. 고객이 질문을 생각하거나 메뉴를 다시 찾는 부담을 줄이는 구성입니다.', provenance:'2026.09.30 새 브라우저에서 상담창을 열어 촬영했습니다. 질문은 전송하지 않았습니다.', status:'직접 촬영'},
  conversation: {src:'assets/yonseistar-user-conversation.png', alt:'사용자 제공 연세스타 대화 화면. 초진 여부를 확인한 뒤 연락처를 요청합니다.', title:'상담을 병원의 후속 연락으로 연결합니다.', description:'문신 제거 비용을 묻자 방문 유형을 확인하고, 초진이라는 답변 후 연락처를 요청합니다. 이 대화에서는 즉시 가격 숫자를 제시하기보다 상담 접수에 필요한 정보를 먼저 받습니다.', provenance:'사용자께서 제공한 원본 캡처입니다. 이번 조사에서 이 대화를 새로 전송하거나 재현하지는 않았습니다.', status:'사용자 제공 화면'},
  booking: {src:'assets/yonseistar-booking.png', alt:'이름과 연락처, 희망 시술과 날짜를 받는 연세스타 예약 신청 양식', title:'예약 신청과 확정 단계를 구분합니다.', description:'이름·전화번호·한국 번호 여부·초진/재진·희망 시술·날짜와 시간을 받습니다. 양식에는 병원 확인 후 확정 연락을 드린다고 명시되어 있습니다.', provenance:'2026.09.30 예약 신청 버튼을 눌러 촬영했습니다. 개인정보를 입력하거나 예약을 제출하지 않았습니다.', status:'직접 촬영'},
  mobile: {src:'assets/yonseistar-mobile.png', alt:'390픽셀 폭에서 연세스타 상담창을 열어 촬영한 화면', title:'모바일에서도 상담 진입 화면이 열립니다.', description:'390 × 844 화면에서 AI 상담창이 열리는 모습을 확인했습니다. 실제 메시지 전송, 사진 첨부와 예약 완료까지 검증한 결과는 아닙니다.', provenance:'2026.09.30 브라우저의 390 × 844 화면 크기로 촬영했습니다. 실제 휴대전화 기기에서의 검증과는 구분합니다.', status:'모바일 폭 촬영'}
};

document.querySelectorAll('.shot-tab').forEach(button => {
  button.addEventListener('click', () => {
    const shot = shots[button.dataset.shot];
    document.querySelectorAll('.shot-tab').forEach(tab => {
      const selected = tab === button;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-pressed', String(selected));
    });
    const img = byId('case-image');
    img.src = shot.src;
    img.alt = shot.alt;
    byId('case-image-button').dataset.image = shot.src;
    byId('case-image-button').dataset.caption = `${shot.title} — ${shot.provenance}`;
    byId('case-image-button').closest('.screenshot-stage').classList.toggle('mobile-shot', button.dataset.shot === 'mobile');
    byId('shot-title').textContent = shot.title;
    byId('shot-description').textContent = shot.description;
    byId('shot-provenance').textContent = shot.provenance;
    byId('shot-status').textContent = shot.status;
  });
});

const diagram = {
  site: {status:'직접 확인', className:'fact', title:'홈페이지 자체에 채팅 화면이 구현되어 있습니다.', text:'분석 페이지의 iframe 개수는 0개였으며, 홈페이지 내 대화창이 열립니다. 서버 응답에는 Next.js와 Vercel이 표시됩니다. 참고 사이트는 아임웹에서 검증한 사례가 아닙니다.', code:'server: Vercel · x-powered-by: Next.js'},
  api: {status:'공개 코드에서 확인', className:'fact', title:'질문을 외부 레이니 서버로 전달하는 통로입니다.', text:'외부 상담 API 경로가 있고, 병원 식별 정보·언어·시간대를 전달하는 코드가 있습니다. 상담 기능에 사용하는 주소이며, 모든 개발자에게 개방된 상품이라고 확인한 것은 아닙니다.', code:'https://api.laney.app/api/chat/external'},
  data: {status:'업체 공식 문서상 구조', className:'provider', title:'등록된 병원 정보가 답변의 바탕이 됩니다.', text:'레이니 문서는 시술·가격·의료진 등 등록 정보를 조회하여 답을 구성한다고 설명합니다. 연세스타 내부의 실제 데이터·프롬프트·사용 AI 모델은 외부에서 확인되지 않았습니다.', code:'병원 정보 조회 → 고객 질문에 맞는 답변 구성'},
  reply: {status:'구현 구성 확인', className:'fact', title:'답변 스트리밍과 대화 이력 연결 코드가 있습니다.', text:'답변을 받아 처리하고, 대화를 생성하거나 불러오는 함수가 확인됩니다. 실제 메시지 전송·이력 복원·CRM 저장을 완료한 것으로 판단하지는 않았습니다.', code:'processResponseStream · createChatSession · loadChatMessages'}
};

document.querySelectorAll('.architecture-node').forEach(button => {
  button.addEventListener('click', () => {
    const item = diagram[button.dataset.architecture];
    document.querySelectorAll('.architecture-node').forEach(node => {
      const selected = node === button;
      node.classList.toggle('selected', selected);
      node.setAttribute('aria-pressed', String(selected));
    });
    const detail = byId('architecture-detail');
    const badge = detail.querySelector('.badge');
    badge.className = `badge ${item.className}`;
    badge.textContent = item.status;
    detail.querySelector('h3').textContent = item.title;
    detail.querySelector('p').textContent = item.text;
    detail.querySelector('code').textContent = item.code;
  });
});

const won = amount => `${Math.round(amount).toLocaleString('ko-KR')}원`;
const manWon = amount => `${(amount / 10000).toLocaleString('ko-KR', {maximumFractionDigits:1})}만원`;
const range = (low, high, format) => Math.abs(low-high)<0.01 ? format(low) : `${format(low)} ~ ${format(high)}`;

function calculateBudget() {
  const raw = byId('inquiries').value.trim();
  const count = Number(raw);
  const valid = raw !== '' && Number.isFinite(count) && Number.isInteger(count) && count >= 1 && count <= 10000;
  byId('input-error').hidden = valid;
  byId('inquiries').setAttribute('aria-invalid', String(!valid));
  document.querySelectorAll('[data-inquiries]').forEach(button => button.classList.toggle('active', valid && Number(button.dataset.inquiries) === count));
  if (!valid) {
    byId('plan-status').className = 'badge unknown';
    byId('plan-status').textContent = '입력 확인 필요';
    byId('plan-name').textContent = '계산을 보류했습니다.';
    byId('monthly-result').textContent = '인원을 입력해 주십시오.';
    ['unit-result','annual-result','average-result','setup-result'].forEach(id => {byId(id).textContent = '—';});
    byId('model-explanation').textContent = '유효한 인원을 입력하시면 비용을 다시 계산합니다.';
    byId('estimate-details').hidden = true;
    return;
  }
  const estimate = count > 450;
  const basicMonthly = count <= 150 ? 190000 : 490000;
  const lowBase = estimate ? 490000 * count / 450 : basicMonthly;
  const highBase = estimate ? 490000 * Math.ceil(count / 450) : basicMonthly;
  const extra = byId('crm').checked ? 200000 : 0;
  const multiplier = byId('vat').checked ? 1.1 : 1;
  const setupBase = Number(byId('setup').value);
  const setup = setupBase * multiplier;
  const low = (lowBase + extra) * multiplier;
  const high = (highBase + extra) * multiplier;
  byId('plan-status').className = `badge ${estimate ? 'inference' : 'provider'}`;
  byId('plan-status').textContent = estimate ? '확장 예산 가정 · 견적 아님' : '공개 요금 기반';
  byId('plan-name').textContent = estimate ? 'Enterprise 견적 필요' : `${count <= 150 ? 'Small' : 'Pro'} 기준 예산`;
  byId('vat-label').textContent = byId('vat').checked ? 'VAT 포함' : 'VAT 별도';
  byId('monthly-result').textContent = `${estimate ? '약 ' : ''}${range(low, high, manWon)}`;
  byId('unit-result').textContent = `약 ${range(low / count, high / count, won)} / 명`;
  byId('annual-result').textContent = `${estimate ? '약 ' : ''}${range(setup + low*12, setup + high*12, manWon)}`;
  byId('average-result').textContent = `${estimate ? '약 ' : ''}${range(setup/12+low, setup/12+high, manWon)}`;
  byId('setup-result').textContent = manWon(setup);
  byId('model-explanation').textContent = estimate
    ? '공개 Enterprise 가격은 없습니다. 표시 금액은 Pro 비용을 문의량에 비례해 확장한 계획용 가정입니다. 실제 견적은 이 범위 밖일 수 있습니다.'
    : `월 ${count <= 150 ? '150명 이하에서는 Small' : '151~450명 구간에서는 Pro'} 공개 요금을 비교 기준으로 사용했습니다. 권장량은 사용 한도가 아니며, 실제 사용량 산정·초과 정책은 확인이 필요합니다.`;
  byId('estimate-details').hidden = !estimate;
}

['inquiries','vat','crm','setup'].forEach(id => {byId(id).addEventListener('input', calculateBudget);});
document.querySelectorAll('[data-inquiries]').forEach(button => button.addEventListener('click', () => {byId('inquiries').value = button.dataset.inquiries;calculateBudget();}));
calculateBudget();

const imageDialog = byId('image-dialog');
document.querySelectorAll('[data-image]').forEach(button => {
  button.addEventListener('click', () => {
    byId('expanded-image').src = button.dataset.image;
    byId('expanded-image').alt = button.querySelector('img').alt;
    byId('image-caption').textContent = button.dataset.caption || button.querySelector('img').alt;
    imageDialog.showModal();
    document.body.classList.add('modal-open');
  });
});
byId('image-close').addEventListener('click', () => imageDialog.close());
imageDialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
imageDialog.addEventListener('click', event => {if (event.target === imageDialog) {const rect=imageDialog.getBoundingClientRect();if(event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) imageDialog.close();}});

byId('print-button').addEventListener('click', () => window.print());
byId('demo-open').addEventListener('click', () => {byId('demo-panel').hidden = false;byId('demo-close').focus();});
byId('demo-close').addEventListener('click', () => {byId('demo-panel').hidden = true;byId('demo-open').focus();});
byId('demo-panel').addEventListener('keydown', event => {if(event.key === 'Escape'){byId('demo-panel').hidden = true;byId('demo-open').focus();}});
