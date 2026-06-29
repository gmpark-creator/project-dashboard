/* Paralex · Vocab Day 단위(SRS) 재편성 — 기존 vocab-seed(10)+vocab-002(30)=40 흡수 + 신규 20 = 60.
   Day1 = 혼동어쌍 + 핵심 콜로케이션 30 / Day2 = 비즈니스 콜로케이션 + 동사·전치사구 30.
   각 카드에 id·example·tags 추가. example/glossKo/collocation 자체작성 original. */
window.PARALEX_VOCAB_DAYS = window.PARALEX_VOCAB_DAYS || [];
window.PARALEX_VOCAB_DAYS.push(
  {
    day: 1,
    title: "Confusables & Core Collocations",
    cards: [
      /* ── 혼동어쌍 20 (기존 14 + 신규 6) ── */
      { id:"d1-01", lemma:"assure / ensure / insure", pos:"v.", glossKo:"assure=안심시키다(사람) · ensure=확실히 하다(일) · insure=보험 들다", collocation:"assure clients · ensure compliance · insure the cargo", example:"I assure you the cargo is handled carefully, but please insure it to ensure full coverage.", listTag:"TSL", tags:["confusable"] },
      { id:"d1-02", lemma:"affect / effect", pos:"v./n.", glossKo:"affect=영향을 주다(동사) · effect=효과(명사)/초래하다", collocation:"affect sales · have an effect on", example:"The new policy will affect morale, and its effect on output is already visible.", listTag:"NGSL", tags:["confusable"] },
      { id:"d1-03", lemma:"principal / principle", pos:"adj./n.", glossKo:"principal=주요한·원금·교장 · principle=원칙", collocation:"principal amount · on principle", example:"The principal reason we refused the deal was a matter of principle.", listTag:"NAWL", tags:["confusable"] },
      { id:"d1-04", lemma:"complement / compliment", pos:"v.", glossKo:"complement=보완하다 · compliment=칭찬하다", collocation:"complement the design · pay a compliment", example:"The navy tie complements your suit, and several guests paid you a compliment.", listTag:"NAWL", tags:["confusable"] },
      { id:"d1-05", lemma:"stationary / stationery", pos:"adj./n.", glossKo:"stationary=움직이지 않는(정지한) · stationery=문구류", collocation:"remain stationary · order office stationery", example:"The truck stayed stationary at the dock while we loaded boxes of stationery.", listTag:"NAWL", tags:["confusable"] },
      { id:"d1-06", lemma:"adverse / averse", pos:"adj.", glossKo:"adverse=불리한·악영향의(상황) · averse=싫어하는(사람의 태도)", collocation:"adverse weather conditions · be averse to risk", example:"Investors who are averse to risk tend to avoid markets in adverse conditions.", listTag:"NAWL", tags:["confusable"] },
      { id:"d1-07", lemma:"precede / proceed", pos:"v.", glossKo:"precede=~보다 앞서다 · proceed=계속 진행하다·나아가다", collocation:"precede the keynote · proceed to checkout", example:"A short welcome will precede the awards, and dinner will proceed afterward.", listTag:"NAWL", tags:["confusable"] },
      { id:"d1-08", lemma:"respectfully / respectively", pos:"adv.", glossKo:"respectfully=정중하게 · respectively=각각(언급한 순서대로)", collocation:"respectfully decline · A and B cost $5 and $8 respectively", example:"The two bids came in at $4,000 and $6,000 respectively, and we respectfully declined both.", listTag:"NAWL", tags:["confusable"] },
      { id:"d1-09", lemma:"imply / infer", pos:"v.", glossKo:"imply=(화자가) 넌지시 비치다·함축하다 · infer=(청자가) 추론하다", collocation:"the memo implies a delay · infer the cause from data", example:"The memo seems to imply a delay, so from it we can infer that the launch will slip.", listTag:"NAWL", tags:["confusable"] },
      { id:"d1-10", lemma:"economic / economical", pos:"adj.", glossKo:"economic=경제의(경제 관련) · economical=경제적인·절약하는", collocation:"economic growth · an economical engine", example:"As economic growth slowed, the firm switched to a more economical supplier.", listTag:"NAWL", tags:["confusable"] },
      { id:"d1-11", lemma:"considerable / considerate", pos:"adj.", glossKo:"considerable=상당한(양·정도가 큰) · considerate=사려 깊은(배려하는)", collocation:"a considerable increase · a considerate host", example:"A considerate manager gave the team considerable time to recover from the outage.", listTag:"NAWL", tags:["confusable"] },
      { id:"d1-12", lemma:"sensible / sensitive", pos:"adj.", glossKo:"sensible=분별 있는·합리적인 · sensitive=민감한·예민한", collocation:"a sensible decision · sensitive information", example:"It is sensible to encrypt sensitive customer data before sharing it.", listTag:"NAWL", tags:["confusable"] },
      { id:"d1-13", lemma:"industrial / industrious", pos:"adj.", glossKo:"industrial=산업의·공업의 · industrious=근면한·부지런한", collocation:"industrial equipment · an industrious employee", example:"The industrious crew finished the industrial park well ahead of schedule.", listTag:"NAWL", tags:["confusable"] },
      { id:"d1-14", lemma:"continual / continuous", pos:"adj.", glossKo:"continual=반복적인(간헐 반복) · continuous=끊김 없는(연속적)", collocation:"continual interruptions · continuous monitoring", example:"Continual outages finally forced us to install a continuous backup power supply.", listTag:"NAWL", tags:["confusable"] },
      { id:"d1-15", lemma:"discreet / discrete", pos:"adj.", glossKo:"discreet=신중한·입이 무거운 · discrete=별개의·분리된", collocation:"be discreet about the merger · a discrete line item", example:"Keep the merger discreet, and report each cost as a discrete line item.", listTag:"NAWL", tags:["confusable"] },
      { id:"d1-16", lemma:"eminent / imminent", pos:"adj.", glossKo:"eminent=저명한·탁월한 · imminent=임박한", collocation:"an eminent economist · an imminent deadline", example:"An eminent economist warned that a downturn was imminent.", listTag:"NAWL", tags:["confusable"] },
      { id:"d1-17", lemma:"elicit / illicit", pos:"v./adj.", glossKo:"elicit=(반응·정보를) 이끌어내다 · illicit=불법의·부정한", collocation:"elicit feedback · illicit transfers", example:"Auditors tried to elicit more detail about the illicit transfers.", listTag:"NAWL", tags:["confusable"] },
      { id:"d1-18", lemma:"appraise / apprise", pos:"v.", glossKo:"appraise=(가치를) 평가·감정하다 · apprise=알리다·통지하다", collocation:"appraise the property · apprise the board", example:"Please apprise the board as soon as you appraise the property's value.", listTag:"NAWL", tags:["confusable"] },
      { id:"d1-19", lemma:"personal / personnel", pos:"adj./n.", glossKo:"personal=개인의·사적인 · personnel=인사(부)·직원", collocation:"personal belongings · personnel records", example:"Personnel decisions should never be driven by personal bias.", listTag:"NAWL", tags:["confusable"] },
      { id:"d1-20", lemma:"disinterested / uninterested", pos:"adj.", glossKo:"disinterested=공정한·사심 없는 · uninterested=무관심한", collocation:"a disinterested arbitrator · an uninterested audience", example:"We need a disinterested arbitrator, not one who is simply uninterested in the case.", listTag:"NAWL", tags:["confusable"] },
      /* ── 핵심 콜로케이션 10 (신규) ── */
      { id:"d1-21", lemma:"conduct a survey", pos:"v.+n.", glossKo:"설문조사를 실시하다", collocation:"conduct a survey of customers", example:"Marketing will conduct a survey of new customers next quarter.", listTag:"BSL", tags:["collocation"] },
      { id:"d1-22", lemma:"raise awareness", pos:"v.+n.", glossKo:"인식을 높이다·알리다", collocation:"raise awareness of safety", example:"The campaign is designed to raise awareness of workplace safety.", listTag:"NGSL", tags:["collocation"] },
      { id:"d1-23", lemma:"launch a campaign", pos:"v.+n.", glossKo:"캠페인을 시작하다", collocation:"launch an ad campaign", example:"The agency plans to launch a campaign just ahead of the holidays.", listTag:"BSL", tags:["collocation"] },
      { id:"d1-24", lemma:"implement a policy", pos:"v.+n.", glossKo:"정책을 시행하다", collocation:"implement a remote-work policy", example:"Management will implement a remote-work policy starting in March.", listTag:"BSL", tags:["collocation"] },
      { id:"d1-25", lemma:"exceed expectations", pos:"v.+n.", glossKo:"기대를 뛰어넘다", collocation:"exceed sales expectations", example:"Quarterly sales exceeded expectations by a wide margin.", listTag:"BSL", tags:["collocation"] },
      { id:"d1-26", lemma:"gain access", pos:"v.+n.", glossKo:"접근 권한을 얻다", collocation:"gain access to the lab", example:"Visitors must register at the desk to gain access to the lab.", listTag:"NGSL", tags:["collocation"] },
      { id:"d1-27", lemma:"take effect", pos:"v.+n.", glossKo:"효력이 발생하다·시행되다", collocation:"take effect on Monday", example:"The revised fares take effect on the first of next month.", listTag:"NGSL", tags:["collocation"] },
      { id:"d1-28", lemma:"issue a refund", pos:"v.+n.", glossKo:"환불을 처리하다·지급하다", collocation:"issue a full refund", example:"We will issue a refund as soon as the item is returned.", listTag:"BSL", tags:["collocation"] },
      { id:"d1-29", lemma:"boost productivity", pos:"v.+n.", glossKo:"생산성을 높이다", collocation:"boost team productivity", example:"Ergonomic chairs can noticeably boost productivity over time.", listTag:"BSL", tags:["collocation"] },
      { id:"d1-30", lemma:"set a precedent", pos:"v.+n.", glossKo:"선례를 남기다", collocation:"set a dangerous precedent", example:"Approving this exception could set a precedent for future claims.", listTag:"NAWL", tags:["collocation"] }
    ]
  },
  {
    day: 2,
    title: "Business Collocations & Phrases",
    cards: [
      /* ── 비즈니스 콜로케이션 10 (기존) ── */
      { id:"d2-01", lemma:"meet a deadline", pos:"v.+n.", glossKo:"마감 기한을 지키다", collocation:"meet the project deadline", example:"The design team worked overtime to meet the project deadline.", listTag:"BSL", tags:["collocation"] },
      { id:"d2-02", lemma:"place an order", pos:"v.+n.", glossKo:"주문을 넣다", collocation:"place a bulk order online", example:"You can place an order online or by phone before noon.", listTag:"BSL", tags:["collocation"] },
      { id:"d2-03", lemma:"reach a consensus", pos:"v.+n.", glossKo:"합의에 도달하다", collocation:"reach a consensus on the budget", example:"After hours of debate, the board reached a consensus on the budget.", listTag:"BSL", tags:["collocation"] },
      { id:"d2-04", lemma:"allocate a budget", pos:"v.+n.", glossKo:"예산을 배정하다", collocation:"allocate a budget for marketing", example:"Finance allocated a larger budget for digital marketing this year.", listTag:"BSL", tags:["collocation"] },
      { id:"d2-05", lemma:"address an issue", pos:"v.+n.", glossKo:"문제를 다루다·해결에 나서다", collocation:"address the customer's issue promptly", example:"Support promised to address the billing issue within a day.", listTag:"BSL", tags:["collocation"] },
      { id:"d2-06", lemma:"streamline a process", pos:"v.+n.", glossKo:"절차를 간소화하다·효율화하다", collocation:"streamline the approval process", example:"We streamlined the approval process to cut waiting times in half.", listTag:"BSL", tags:["collocation"] },
      { id:"d2-07", lemma:"waive a fee", pos:"v.+n.", glossKo:"수수료를 면제하다", collocation:"waive the late fee for members", example:"The bank agreed to waive the late fee for long-term members.", listTag:"BSL", tags:["collocation"] },
      { id:"d2-08", lemma:"expedite shipping", pos:"v.+n.", glossKo:"배송을 신속히 처리하다", collocation:"expedite shipping at no extra cost", example:"For urgent orders, we can expedite shipping at no extra cost.", listTag:"BSL", tags:["collocation"] },
      { id:"d2-09", lemma:"retain records", pos:"v.+n.", glossKo:"기록을 보관·유지하다", collocation:"retain records for seven years", example:"Companies must retain tax records for at least seven years.", listTag:"BSL", tags:["collocation"] },
      { id:"d2-10", lemma:"oversee operations", pos:"v.+n.", glossKo:"운영을 총괄·감독하다", collocation:"oversee daily operations", example:"A new director was hired to oversee daily operations at the plant.", listTag:"BSL", tags:["collocation"] },
      /* ── 동사+전치사 10 (기존 8 + 신규 2) ── */
      { id:"d2-11", lemma:"comply with", pos:"v.+prep.", glossKo:"~을 준수하다", collocation:"comply with regulations", example:"All vendors must comply with the new safety regulations.", listTag:"BSL", tags:["preposition"] },
      { id:"d2-12", lemma:"be subject to", pos:"v.+prep.", glossKo:"~의 대상이다 / ~될 수 있다", collocation:"prices are subject to change", example:"Listed prices are subject to change without prior notice.", listTag:"TSL", tags:["preposition"] },
      { id:"d2-13", lemma:"be eligible for", pos:"v.+prep.", glossKo:"~의 자격이 있다", collocation:"be eligible for a refund", example:"Full-time staff are eligible for the annual performance bonus.", listTag:"TSL", tags:["preposition"] },
      { id:"d2-14", lemma:"refrain from", pos:"v.+prep.", glossKo:"~을 삼가다·자제하다", collocation:"refrain from using mobile phones", example:"Passengers should refrain from using phones during takeoff.", listTag:"TSL", tags:["preposition"] },
      { id:"d2-15", lemma:"account for", pos:"v.+prep.", glossKo:"~을 설명하다 / (비율을) 차지하다", collocation:"account for the discrepancy", example:"The manager could not account for the missing inventory.", listTag:"TSL", tags:["preposition"] },
      { id:"d2-16", lemma:"adhere to", pos:"v.+prep.", glossKo:"~을 준수하다·고수하다", collocation:"adhere to safety guidelines", example:"Contractors must adhere to the agreed safety guidelines on site.", listTag:"TSL", tags:["preposition"] },
      { id:"d2-17", lemma:"be exempt from", pos:"v.+prep.", glossKo:"~에서 면제되다", collocation:"be exempt from the service charge", example:"Registered nonprofit groups are exempt from the service charge.", listTag:"TSL", tags:["preposition"] },
      { id:"d2-18", lemma:"compensate for", pos:"v.+prep.", glossKo:"~을 보상하다·만회하다", collocation:"compensate for the delay", example:"A store discount was offered to compensate for the delay.", listTag:"TSL", tags:["preposition"] },
      { id:"d2-19", lemma:"abide by", pos:"v.+prep.", glossKo:"~을 따르다·준수하다", collocation:"abide by the building rules", example:"All tenants must abide by the building's quiet-hours rules.", listTag:"TSL", tags:["preposition"] },
      { id:"d2-20", lemma:"cope with", pos:"v.+prep.", glossKo:"~에 대처하다·감당하다", collocation:"cope with a surge in orders", example:"The small team struggled to cope with the sudden surge in orders.", listTag:"NGSL", tags:["preposition"] },
      /* ── 전치사구 / 정형 표현 10 (기존 8 + 신규 2) ── */
      { id:"d2-21", lemma:"on behalf of", pos:"phr.", glossKo:"~을 대신하여", collocation:"on behalf of the team", example:"On behalf of the entire team, I thank you for your continued support.", listTag:"TSL", tags:["phrase"] },
      { id:"d2-22", lemma:"no later than", pos:"phr.", glossKo:"늦어도 ~까지", collocation:"submit no later than Friday", example:"Completed applications must arrive no later than Friday at 5 p.m.", listTag:"TSL", tags:["phrase"] },
      { id:"d2-23", lemma:"in accordance with", pos:"phr.", glossKo:"~에 따라", collocation:"in accordance with policy", example:"All personal data is handled in accordance with our privacy policy.", listTag:"BSL", tags:["phrase"] },
      { id:"d2-24", lemma:"in lieu of", pos:"phr.", glossKo:"~ 대신에", collocation:"a voucher in lieu of a refund", example:"Employees may take a store voucher in lieu of a cash refund.", listTag:"TSL", tags:["phrase"] },
      { id:"d2-25", lemma:"with regard to", pos:"phr.", glossKo:"~에 관하여", collocation:"with regard to your inquiry", example:"With regard to your inquiry, the item is now back in stock.", listTag:"TSL", tags:["phrase"] },
      { id:"d2-26", lemma:"prior to", pos:"phr.", glossKo:"~ 이전에·~에 앞서", collocation:"prior to the meeting", example:"Please confirm your attendance prior to the meeting on Tuesday.", listTag:"TSL", tags:["phrase"] },
      { id:"d2-27", lemma:"free of charge", pos:"phr.", glossKo:"무료로", collocation:"installation is free of charge", example:"Installation and the first service visit are free of charge for new buyers.", listTag:"TSL", tags:["phrase"] },
      { id:"d2-28", lemma:"on short notice", pos:"phr.", glossKo:"촉박한 통보로·갑작스럽게", collocation:"available on short notice", example:"The supplier delivered the replacement parts on short notice.", listTag:"TSL", tags:["phrase"] },
      { id:"d2-29", lemma:"in compliance with", pos:"phr.", glossKo:"~을 준수하여", collocation:"in compliance with the law", example:"The factory now operates in compliance with the new environmental law.", listTag:"BSL", tags:["phrase"] },
      { id:"d2-30", lemma:"ahead of schedule", pos:"phr.", glossKo:"예정보다 일찍", collocation:"finish ahead of schedule", example:"The contractor handed over the bridge two weeks ahead of schedule.", listTag:"BSL", tags:["phrase"] }
    ]
  }
);
