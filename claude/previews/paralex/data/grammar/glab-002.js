window.PARALEX_GLAB = window.PARALEX_GLAB || {};
window.PARALEX_GLAB["glab-002"] = {
  id:"glab-002", title:"Part 6 Text Completion 01", partFocus:["Part6"], scoreBandTarget:"800-850",
  targetTimeSec:480,
  passages:[
    {
      pid:"t1", label:"Email",
      text:"Dear Marketing Team,\n\nThank you for your hard work on the autumn campaign. ____1____ the strong sales figures we reported last quarter, management has decided to expand our advertising budget for the coming season. ____2____ Each of you will receive a revised spending guideline by the end of this week.\n\nPlease note that all updated proposals must be ____3____ to the finance office no later than Thursday. If you anticipate any delays, contact your supervisor ____4____ so that adjustments can be arranged.\n\nBest regards,\nDana Whitfield, Director of Marketing",
      items:[
        {
          no:1, part:"Part6", questionType:"blank", blankId:1,
          choices:[
            {label:"A",text:"Despite"},
            {label:"B",text:"Given"},
            {label:"C",text:"Although"},
            {label:"D",text:"Whereas"}
          ],
          answer:["B"],
          grammarPoint:"conjunction_connector",
          contextEvidence:"'the strong sales figures ... management has decided to expand our advertising budget' — 좋은 실적이 예산 확대의 근거(이유)로 이어진다.",
          explanation:"빈칸 뒤에 명사구('the strong sales figures...')가 오고, 그 사실이 예산 확대의 '근거'가 된다. 전치사 Given('~을 고려하면/감안하면')이 근거 제시에 정확히 맞는다.",
          trapNote:"Although/Whereas는 절을 이끄는 접속사라 명사구 뒤에 올 수 없고, Despite는 양보(역접)라 '좋은 실적 → 예산 확대'라는 순접 인과 흐름과 충돌한다.",
          distractorRationales:[
            {label:"A",type:"wrong_connector",note:"Despite는 양보 전치사 — 실적 호조가 예산 확대로 이어지는 순접 인과와 모순."},
            {label:"C",type:"wrong_connector",note:"Although는 접속사 — 뒤의 명사구가 아니라 절(주어+동사)을 필요로 함."},
            {label:"D",type:"wrong_connector",note:"Whereas는 대조 접속사 — 절을 이끌어야 하고 의미상 대조가 아님."}
          ]
        },
        {
          no:2, part:"Part6", questionType:"sentence_insertion", blankId:2,
          choices:[
            {label:"A",text:"This increase reflects our confidence in the team's recent performance."},
            {label:"B",text:"Unfortunately, the campaign did not meet its initial targets."},
            {label:"C",text:"The office will remain closed for renovations until further notice."},
            {label:"D",text:"Please remember to submit your travel receipts before the audit."}
          ],
          answer:["A"],
          grammarPoint:"part6_sentence_insertion",
          contextEvidence:"앞: '예산을 확대하기로 결정했다', 뒤: '각자 수정된 지출 지침을 받게 된다' — 예산 '증액'을 자연스럽게 설명·연결하는 문장이 필요.",
          explanation:"앞 문장이 예산 확대 결정을, 뒤 문장이 그에 따른 새 지출 지침 배포를 말한다. (A)는 그 '증액(increase)'을 가리키며 팀 성과에 대한 신뢰로 연결해 두 문장을 매끄럽게 잇는다.",
          trapNote:"(B)는 실적 호조라는 앞 문맥과 정면 모순. (C)·(D)는 예산/지출 흐름과 무관한 별개 주제로 단절을 만든다.",
          distractorRationales:[
            {label:"B",type:"close_meaning",note:"campaign을 언급해 그럴듯하나, 앞의 strong sales figures와 모순되는 부정 진술."},
            {label:"C",type:"register_mismatch",note:"사무실 폐쇄 공지로 예산 확대 흐름과 무관."},
            {label:"D",type:"register_mismatch",note:"출장 영수증 제출 안내로 문맥과 단절."}
          ]
        },
        {
          no:3, part:"Part6", questionType:"blank", blankId:3,
          choices:[
            {label:"A",text:"submit"},
            {label:"B",text:"submitting"},
            {label:"C",text:"submitted"},
            {label:"D",text:"submission"}
          ],
          answer:["C"],
          grammarPoint:"word_form",
          contextEvidence:"'all updated proposals must be ____ to the finance office' — 'must be + 과거분사' 수동태 구조.",
          explanation:"조동사 must 뒤에 be가 있으므로 'be + 과거분사'의 수동태가 필요하다. proposals는 제출되는 대상이므로 과거분사 submitted가 정답.",
          trapNote:"be 뒤에 동사원형(submit)이나 명사(submission)는 올 수 없고, be submitting(능동 진행)은 '제안서가 제출하고 있다'가 되어 의미가 어긋난다.",
          distractorRationales:[
            {label:"A",type:"wrong_form",note:"be 뒤에 동사원형 불가 — 수동태 형태 위반."},
            {label:"B",type:"wrong_form",note:"be submitting은 능동 진행 — 제안서는 제출 '되는' 대상이라 수동이 맞음."},
            {label:"D",type:"wrong_form",note:"명사 submission은 be 뒤 수동태 자리에 부적합."}
          ]
        },
        {
          no:4, part:"Part6", questionType:"blank", blankId:4,
          choices:[
            {label:"A",text:"promptly"},
            {label:"B",text:"prompt"},
            {label:"C",text:"prompted"},
            {label:"D",text:"promptness"}
          ],
          answer:["A"],
          grammarPoint:"word_form",
          contextEvidence:"'contact your supervisor ____ so that adjustments can be arranged' — 완전한 동사구(contact your supervisor)를 수식.",
          explanation:"이미 'contact your supervisor'라는 완전한 명령문 구조가 있으므로 빈칸은 동사를 수식하는 부사 자리다. '즉시 연락하라'는 의미의 부사 promptly가 정답.",
          trapNote:"형용사 prompt, 과거분사 prompted, 명사 promptness는 모두 완전한 동사구 뒤 부사 자리에 들어갈 수 없다.",
          distractorRationales:[
            {label:"B",type:"wrong_form",note:"형용사 — 동사 contact를 수식할 수 없음."},
            {label:"C",type:"wrong_form",note:"과거분사/형용사형 — 부사 자리 부적합."},
            {label:"D",type:"wrong_form",note:"명사 — 동사 수식 불가."}
          ]
        }
      ]
    },
    {
      pid:"t2", label:"Notice",
      text:"NOTICE TO ALL BUILDING TENANTS\n\nThe lobby elevators will undergo scheduled maintenance ____1____ Monday, beginning at 7:00 A.M. During this period, only the freight elevator at the rear of the building will be available. ____2____ We apologize for any inconvenience this may cause.\n\nTenants who require assistance moving large items ____3____ contact the facilities desk in advance. The maintenance crew expects ____4____ the work before noon, and normal service will resume immediately afterward.\n\nFacilities Management",
      items:[
        {
          no:1, part:"Part6", questionType:"blank", blankId:1,
          choices:[
            {label:"A",text:"in"},
            {label:"B",text:"at"},
            {label:"C",text:"on"},
            {label:"D",text:"by"}
          ],
          answer:["C"],
          grammarPoint:"preposition",
          contextEvidence:"'undergo scheduled maintenance ____ Monday' — 특정 요일 앞 전치사.",
          explanation:"요일(Monday) 앞에는 전치사 on을 쓴다. 'on Monday'가 정답.",
          trapNote:"in은 월·연도·기간, at은 시각, by는 '~까지(기한)'에 쓰며 요일 앞에는 부적합하다.",
          distractorRationales:[
            {label:"A",type:"wrong_preposition",note:"in은 달·연도 등 큰 시간 단위 — 요일과 불일치."},
            {label:"B",type:"wrong_preposition",note:"at은 시각(at 7:00)에 사용 — 요일에는 안 씀."},
            {label:"D",type:"wrong_preposition",note:"by는 기한('~까지')의미 — 시작 요일을 가리키지 못함."}
          ]
        },
        {
          no:2, part:"Part6", questionType:"sentence_insertion", blankId:2,
          choices:[
            {label:"A",text:"Tenants are therefore advised to allow extra time for deliveries on that day."},
            {label:"B",text:"The new fitness center will open on the third floor next month."},
            {label:"C",text:"All parking permits must be renewed at the front office annually."},
            {label:"D",text:"Visitors are welcome to use the rooftop garden during business hours."}
          ],
          answer:["A"],
          grammarPoint:"part6_sentence_insertion",
          contextEvidence:"앞: '화물 엘리베이터만 이용 가능', 뒤: '불편을 끼쳐 죄송합니다' — 이용 제한에 따른 입주자 안내가 필요.",
          explanation:"앞 문장이 엘리베이터 이용이 제한된다고 했고 뒤 문장이 불편에 대한 사과로 이어진다. (A)는 그 제한 때문에 '배송에 여유 시간을 두라'고 안내하여 인과 흐름을 자연스럽게 연결한다.",
          trapNote:"(B)·(C)·(D)는 피트니스 센터·주차증·옥상 정원 등 엘리베이터 점검과 무관한 새 화제로 흐름을 끊는다.",
          distractorRationales:[
            {label:"B",type:"register_mismatch",note:"피트니스 센터 개관 안내 — 점검 공지와 무관."},
            {label:"C",type:"register_mismatch",note:"주차증 갱신 안내 — 본문 화제와 단절."},
            {label:"D",type:"register_mismatch",note:"옥상 정원 이용 안내 — 점검 흐름과 무관."}
          ]
        },
        {
          no:3, part:"Part6", questionType:"blank", blankId:3,
          choices:[
            {label:"A",text:"should"},
            {label:"B",text:"having"},
            {label:"C",text:"being"},
            {label:"D",text:"to be"}
          ],
          answer:["A"],
          grammarPoint:"part6_cohesion",
          contextEvidence:"'Tenants who require assistance ... ____ contact the facilities desk in advance' — 주어(Tenants) 뒤 본동사 자리, 권고의 의미.",
          explanation:"'Tenants who require assistance moving large items'가 주어이고 뒤에 본동사가 필요하다. 권고를 나타내는 조동사 should + 동사원형(contact)이 '미리 연락해야 한다'는 의미로 정답.",
          trapNote:"having·being·to be는 본동사 역할을 못 해 주어 뒤 술어 자리를 채울 수 없다(문장이 동사 없이 비문이 됨).",
          distractorRationales:[
            {label:"B",type:"wrong_form",note:"분사 having — 본동사가 될 수 없어 문장이 미완성."},
            {label:"C",type:"wrong_form",note:"분사 being — 술어 동사 자리 부적합."},
            {label:"D",type:"wrong_form",note:"to부정사 — 정동사 자리를 채우지 못함."}
          ]
        },
        {
          no:4, part:"Part6", questionType:"blank", blankId:4,
          choices:[
            {label:"A",text:"completing"},
            {label:"B",text:"to complete"},
            {label:"C",text:"completed"},
            {label:"D",text:"completes"}
          ],
          answer:["B"],
          grammarPoint:"word_form",
          contextEvidence:"'The maintenance crew expects ____ the work before noon' — expect + to부정사 구문(주어 crew가 완료 주체).",
          explanation:"동사 expect는 'expect + to부정사'(주어가 그 행위의 주체) 형태를 취한다. 정비팀이 작업을 완료하는 주체이므로 to부정사 to complete가 정답: 'expects to complete the work before noon'.",
          trapNote:"동명사 completing은 expect의 목적어가 될 수 없고(expect to do / expect that~), 과거분사 completed·정동사 completes도 expect 바로 뒤 자리에 올 수 없다.",
          distractorRationales:[
            {label:"A",type:"wrong_form",note:"expect는 동명사를 목적어로 취하지 않음(expect to do)."},
            {label:"C",type:"wrong_form",note:"과거분사 completed — expect 뒤 동사 자리에 부적합."},
            {label:"D",type:"wrong_tense",note:"정동사 completes — expect 뒤에 정동사가 바로 올 수 없음."}
          ]
        }
      ]
    }
  ],
  reviewGates:{
    legal:{pass:true,reviewer:"Claude",note:"자체작성 original"},
    originality:{pass:true,reviewer:"Claude",note:"백지 작성"},
    answerability:{pass:true,reviewer:"Claude",note:"문맥 근거 정답 유일"},
    grammarAccuracy:{pass:true,reviewer:"Claude",note:"문법·문맥 정확"},
    distractor:{pass:true,reviewer:"Claude",note:"오답 타입태그"},
    human:{pass:false,reviewer:null,note:"박사 검수 전 — practice"} },
  version:"2026-06-29"
};
