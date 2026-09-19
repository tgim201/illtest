/**
 * engine.js - 게임 라이프사이클, 타이머, 스테이지 인터랙션 및 결과 제어 엔진
 */

const GameEngine = (function() {

    let state = {
        student: {
            name: "",
            gradeClass: ""
        },
        currentMissionIdx: 0,
        timerInterval: null,
        remainingSeconds: 300,
        totalTimeSeconds: 300,
        startTime: null,
        endTime: null,
        isCompleted: false,
        scores: {
            pisa_access: 0,
            pisa_integrate: 0,
            pisa_evaluate: 0,
            big6_task_def: 0,
            big6_seeking_strat: 0,
            big6_location_access: 0,
            big6_use_info: 0,
            big6_synthesis: 0,
            big6_evaluation: 0
        },
        answers: {}
    };

    // DOM 요소 캐싱
    let dom = {};

    function init() {
        cacheDom();
        bindEvents();
        updateSoundButton();
    }

    function cacheDom() {
        dom.screenIntro = document.getElementById('screen-intro');
        dom.screenGame = document.getElementById('screen-game');
        dom.screenReport = document.getElementById('screen-report');

        dom.studentNameInput = document.getElementById('input-student-name');
        dom.studentGradeInput = document.getElementById('input-student-grade');
        dom.btnStartGame = document.getElementById('btn-start-game');

        dom.timerDisplay = document.getElementById('timer-display');
        dom.timerProgressBar = document.getElementById('timer-progress');
        dom.headerStudentName = document.getElementById('header-student-name');
        dom.missionProgressBar = document.getElementById('mission-progress-bar');
        dom.missionStepIndicators = document.getElementById('mission-steps');

        dom.missionContainer = document.getElementById('mission-container');
        dom.btnSoundToggle = document.getElementById('btn-sound-toggle');

        // Report
        dom.reportStudentName = document.getElementById('report-student-name');
        dom.reportTimeElapsed = document.getElementById('report-time-elapsed');
        dom.reportPisaBadge = document.getElementById('report-pisa-badge');
        dom.reportPisaLevelTitle = document.getElementById('report-pisa-level-title');
        dom.reportPisaTotalScore = document.getElementById('report-pisa-total-score');
        dom.reportPisaDesc = document.getElementById('report-pisa-desc');
        dom.pisaBarAccess = document.getElementById('pisa-bar-access');
        dom.pisaBarIntegrate = document.getElementById('pisa-bar-integrate');
        dom.pisaBarEvaluate = document.getElementById('pisa-bar-evaluate');
        dom.pisaValAccess = document.getElementById('pisa-val-access');
        dom.pisaValIntegrate = document.getElementById('pisa-val-integrate');
        dom.pisaValEvaluate = document.getElementById('pisa-val-evaluate');

        dom.reportStrengthList = document.getElementById('report-strengths');
        dom.reportImproveList = document.getElementById('report-improvements');
        dom.reportBestSkill = document.getElementById('report-best-skill');
        dom.reportWeakSkill = document.getElementById('report-weak-skill');

        dom.btnPrintReport = document.getElementById('btn-print-report');
        dom.btnExportCsv = document.getElementById('btn-export-csv');
        dom.btnRestart = document.getElementById('btn-restart');
    }

    function bindEvents() {
        dom.btnStartGame.addEventListener('click', startGame);

        dom.btnSoundToggle.addEventListener('click', () => {
            const isMuted = SoundEngine.toggleMute();
            updateSoundButton();
            if (!isMuted) SoundEngine.playClick();
        });

        dom.btnPrintReport.addEventListener('click', () => {
            SoundEngine.playClick();
            window.print();
        });

        dom.btnExportCsv.addEventListener('click', () => {
            SoundEngine.playClick();
            const formattedTime = formatTime(Math.round((state.endTime - state.startTime) / 1000));
            const finalScores = ReportManager.calculateFinalScores(state.scores);
            ReportManager.exportResultsToCSV(state.student, finalScores, formattedTime);
        });

        dom.btnRestart.addEventListener('click', () => {
            SoundEngine.playClick();
            resetGame();
        });
    }

    function updateSoundButton() {
        const muted = SoundEngine.isMuted();
        dom.btnSoundToggle.innerHTML = muted ? '🔇 소리 끔' : '🔊 소리 켬';
        dom.btnSoundToggle.classList.toggle('muted', muted);
    }

    function startGame() {
        SoundEngine.playClick();
        const nameVal = dom.studentNameInput.value.trim();
        const gradeVal = dom.studentGradeInput.value.trim();

        state.student.name = nameVal || "수습 수사관";
        state.student.gradeClass = gradeVal || "미기재";

        dom.headerStudentName.textContent = state.student.name;

        // 화면 전환
        dom.screenIntro.classList.remove('active');
        dom.screenReport.classList.remove('active');
        dom.screenGame.classList.add('active');

        // 상태 초기화
        state.currentMissionIdx = 0;
        state.remainingSeconds = QUEST_DATA.meta.timeLimitSeconds;
        state.totalTimeSeconds = QUEST_DATA.meta.timeLimitSeconds;
        state.startTime = new Date();
        state.isCompleted = false;

        startTimer();
        renderMissionStepIndicators();
        loadMission(state.currentMissionIdx);
    }

    function startTimer() {
        updateTimerDisplay();
        clearInterval(state.timerInterval);

        state.timerInterval = setInterval(() => {
            state.remainingSeconds--;
            updateTimerDisplay();

            if (state.remainingSeconds <= 30 && state.remainingSeconds > 0) {
                dom.timerDisplay.classList.add('pulse-warning');
                if (state.remainingSeconds <= 10) SoundEngine.playTick();
            }

            if (state.remainingSeconds <= 0) {
                clearInterval(state.timerInterval);
                SoundEngine.playError();
                alert("⏰ 제한 시간(5분)이 종료되었습니다! 현재까지 수집된 단서를 바탕으로 최종 진단 리포트를 생성합니다.");
                finishGame();
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        const mins = Math.floor(state.remainingSeconds / 60);
        const secs = state.remainingSeconds % 60;
        dom.timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

        const pct = (state.remainingSeconds / state.totalTimeSeconds) * 100;
        dom.timerProgressBar.style.width = `${pct}%`;
    }

    function renderMissionStepIndicators() {
        dom.missionStepIndicators.innerHTML = "";
        QUEST_DATA.missions.forEach((m, idx) => {
            const stepEl = document.createElement('div');
            stepEl.className = `step-dot ${idx === 0 ? 'current' : ''}`;
            stepEl.innerHTML = `<span class="step-num">${idx + 1}</span><span class="step-label">${m.stageName}</span>`;
            dom.missionStepIndicators.appendChild(stepEl);
        });
    }

    function updateStepIndicators(idx) {
        const dots = dom.missionStepIndicators.querySelectorAll('.step-dot');
        dots.forEach((d, i) => {
            d.classList.remove('current', 'completed');
            if (i < idx) d.classList.add('completed');
            else if (i === idx) d.classList.add('current');
        });
    }

    function loadMission(idx) {
        if (idx >= QUEST_DATA.missions.length) {
            finishGame();
            return;
        }

        updateStepIndicators(idx);
        const mission = QUEST_DATA.missions[idx];
        dom.missionContainer.innerHTML = "";

        // 미션 헤더 생성
        const headerEl = document.createElement('div');
        headerEl.className = 'mission-header-card';
        headerEl.innerHTML = `
            <div class="mission-tags">
                <span class="badge-stage">${mission.stageName}</span>
                ${mission.skillBadges.map(b => `<span class="badge-skill">${b}</span>`).join('')}
            </div>
            <h2 class="mission-title">${mission.title}</h2>
            <p class="mission-subtitle">${mission.subtitle}</p>
            <div class="mission-prompt-box">
                <span class="prompt-icon">🕵️</span>
                <span class="prompt-text">${mission.storyPrompt}</span>
            </div>
        `;
        dom.missionContainer.appendChild(headerEl);

        // 미션 타입별 바디 렌더링
        switch (mission.type) {
            case 'quiz_multi':
                renderQuizMulti(mission);
                break;
            case 'feed_select':
                renderFeedSelect(mission);
                break;
            case 'fact_checker':
                renderFactChecker(mission);
                break;
            case 'synthesis_report':
                renderSynthesisReport(mission);
                break;
        }

        // 스크롤 맨 위로 부드럽게 이동
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /* ========================================================
       미션 타입 1 & 3: 복수 퀴즈 문항 (문서 첨부형)
       ======================================================== */
    function renderQuizMulti(mission) {
        const bodyEl = document.createElement('div');
        bodyEl.className = 'mission-body-container';

        // 단일 문서 or 복수 문서 렌더링
        if (mission.document) {
            const docEl = document.createElement('div');
            docEl.className = 'evidence-doc-box single-doc';
            docEl.innerHTML = `
                <div class="doc-header"><span class="badge-doc">${mission.document.badge}</span></div>
                <div class="doc-body"><pre>${escapeHtml(mission.document.content)}</pre></div>
            `;
            bodyEl.appendChild(docEl);
        } else if (mission.documents) {
            const docsWrapper = document.createElement('div');
            docsWrapper.className = 'multi-docs-grid';
            mission.documents.forEach(doc => {
                const item = document.createElement('div');
                item.className = 'doc-card';
                item.innerHTML = `
                    <div class="doc-title">📂 ${doc.docName}</div>
                    <div class="doc-content">${escapeHtml(doc.body).replace(/\n/g, '<br>')}</div>
                `;
                docsWrapper.appendChild(item);
            });
            bodyEl.appendChild(docsWrapper);
        }

        // 질문 목록 생성
        const userAnswers = {};
        const qContainer = document.createElement('div');
        qContainer.className = 'questions-wrapper';

        mission.questions.forEach((q, qIndex) => {
            const qBox = document.createElement('div');
            qBox.className = 'question-box';
            qBox.innerHTML = `
                <div class="q-header">
                    <span class="q-text">${q.question}</span>
                    <button type="button" class="btn-hint" data-qidx="${qIndex}">💡 힌트 보기</button>
                </div>
                <div class="hint-content" id="hint-box-${mission.id}-${qIndex}" style="display:none;">
                    📌 <strong>수사 길잡이:</strong> ${q.hint}
                </div>
                <div class="options-list" data-qid="${q.qId}">
                    ${q.options.map((opt, optIndex) => `
                        <button type="button" class="btn-option" data-optidx="${optIndex}">
                            <span class="opt-marker">${String.fromCharCode(65 + optIndex)}</span>
                            <span class="opt-label">${opt.text}</span>
                        </button>
                    `).join('')}
                </div>
            `;
            qContainer.appendChild(qBox);
        });
        bodyEl.appendChild(qContainer);

        // 하단 제출 버튼
        const footerEl = document.createElement('div');
        footerEl.className = 'mission-footer-actions';
        footerEl.innerHTML = `
            <div class="submit-feedback-msg" id="feedback-msg-${mission.id}"></div>
            <button type="button" class="btn-action-submit" id="btn-submit-${mission.id}" disabled>
                검증 완료 & 다음 미션으로 →
            </button>
        `;
        bodyEl.appendChild(footerEl);
        dom.missionContainer.appendChild(bodyEl);

        // 힌트 토글 이벤트 바인딩
        qContainer.querySelectorAll('.btn-hint').forEach(hBtn => {
            hBtn.addEventListener('click', (e) => {
                SoundEngine.playClick();
                const qIdx = e.currentTarget.dataset.qidx;
                const hBox = document.getElementById(`hint-box-${mission.id}-${qIdx}`);
                if (hBox.style.display === 'none') {
                    hBox.style.display = 'block';
                    e.currentTarget.textContent = "💡 힌트 닫기";
                } else {
                    hBox.style.display = 'none';
                    e.currentTarget.textContent = "💡 힌트 보기";
                }
            });
        });

        // 보기 선택 이벤트
        const submitBtn = footerEl.querySelector(`#btn-submit-${mission.id}`);
        mission.questions.forEach((q) => {
            const optList = qContainer.querySelector(`[data-qid="${q.qId}"]`);
            optList.querySelectorAll('.btn-option').forEach(optBtn => {
                optBtn.addEventListener('click', () => {
                    SoundEngine.playClick();
                    optList.querySelectorAll('.btn-option').forEach(b => b.classList.remove('selected'));
                    optBtn.classList.add('selected');

                    const optIdx = parseInt(optBtn.dataset.optidx, 10);
                    userAnswers[q.qId] = optIdx;

                    // 모든 문항이 선택되었는지 검사
                    const allSelected = mission.questions.every(item => userAnswers[item.qId] !== undefined);
                    submitBtn.disabled = !allSelected;
                });
            });
        });

        // 제출 이벤트
        submitBtn.addEventListener('click', () => {
            submitBtn.disabled = true;

            // 채점 및 피드백 표시
            let isAllCorrect = true;
            mission.questions.forEach((q) => {
                const selectedIdx = userAnswers[q.qId];
                const selectedOpt = q.options[selectedIdx];
                const optList = qContainer.querySelector(`[data-qid="${q.qId}"]`);
                const buttons = optList.querySelectorAll('.btn-option');

                buttons.forEach((btn, idx) => {
                    btn.disabled = true;
                    if (q.options[idx].correct) {
                        btn.classList.add('correct');
                    } else if (idx === selectedIdx) {
                        btn.classList.add('wrong');
                    }
                });

                if (selectedOpt && selectedOpt.correct) {
                    accumulateScores(selectedOpt.score);
                } else {
                    isAllCorrect = false;
                }
            });

            if (isAllCorrect) {
                SoundEngine.playSuccess();
            } else {
                SoundEngine.playError();
            }

            const feedbackMsg = footerEl.querySelector(`#feedback-msg-${mission.id}`);
            feedbackMsg.innerHTML = isAllCorrect
                ? `<span class="text-success">🎯 훌륭합니다! 정확한 근거와 논리를 찾아냈습니다.</span>`
                : `<span class="text-warning">⚠️ 수사 결과를 기록했습니다. 정답과 해설을 확인하고 계속 전진하세요!</span>`;

            // 1.2초 후 다음 미션으로 자동 또는 버튼 전환
            submitBtn.textContent = "다음 수사 단계 진행 중...";
            setTimeout(() => {
                state.currentMissionIdx++;
                loadMission(state.currentMissionIdx);
            }, 1200);
        });
    }

    /* ========================================================
       미션 타입 2 : 포털 피드 선택 (위치 파악 및 접근)
       ======================================================== */
    function renderFeedSelect(mission) {
        const bodyEl = document.createElement('div');
        bodyEl.className = 'mission-body-container';

        const infoBar = document.createElement('div');
        infoBar.className = 'feed-counter-bar';
        infoBar.innerHTML = `
            <span>선택된 증거 자료: <strong id="feed-selected-count" class="text-highlight">0</strong> / ${mission.requiredCount}개</span>
            <span class="text-muted">가장 신뢰할 수 있는 공식 1차 자료 2개를 스크랩하세요.</span>
        `;
        bodyEl.appendChild(infoBar);

        const feedList = document.createElement('div');
        feedList.className = 'feed-list';

        const selectedSet = new Set();

        mission.items.forEach(item => {
            const feedCard = document.createElement('div');
            feedCard.className = 'feed-item-card';
            feedCard.dataset.itemid = item.itemId;
            feedCard.innerHTML = `
                <div class="feed-header">
                    <span class="feed-source">${item.source}</span>
                    <span class="feed-trust-tag ${item.trustLevel === 'high' ? 'tag-official' : 'tag-unknown'}">
                        ${item.trustLevel === 'high' ? '공식/검증자료' : '미검증/커뮤니티'}
                    </span>
                </div>
                <h4 class="feed-title">${item.title}</h4>
                <p class="feed-snippet">${item.snippet}</p>
                <div class="feed-action">
                    <button type="button" class="btn-scrap">📎 수사 수첩에 스크랩</button>
                </div>
                <div class="feed-explain" style="display:none;"></div>
            `;
            feedList.appendChild(feedCard);
        });
        bodyEl.appendChild(feedList);

        // 푸터 액션
        const footerEl = document.createElement('div');
        footerEl.className = 'mission-footer-actions';
        footerEl.innerHTML = `
            <div class="submit-feedback-msg" id="feedback-msg-${mission.id}"></div>
            <button type="button" class="btn-action-submit" id="btn-submit-${mission.id}" disabled>
                증거 자료 2건 스크랩 확정 →
            </button>
        `;
        bodyEl.appendChild(footerEl);
        dom.missionContainer.appendChild(bodyEl);

        const countDisplay = bodyEl.querySelector('#feed-selected-count');
        const submitBtn = footerEl.querySelector(`#btn-submit-${mission.id}`);

        feedList.querySelectorAll('.feed-item-card').forEach(card => {
            const itemId = card.dataset.itemid;
            const scrapBtn = card.querySelector('.btn-scrap');

            card.addEventListener('click', () => {
                SoundEngine.playClick();
                if (selectedSet.has(itemId)) {
                    selectedSet.delete(itemId);
                    card.classList.remove('selected');
                    scrapBtn.textContent = "📎 수사 수첩에 스크랩";
                } else {
                    if (selectedSet.size >= mission.requiredCount) {
                        alert(`증거 자료는 최대 ${mission.requiredCount}개까지만 선택할 수 있습니다.`);
                        return;
                    }
                    selectedSet.add(itemId);
                    card.classList.add('selected');
                    scrapBtn.textContent = "✅ 스크랩 완료 (선택됨)";
                }

                countDisplay.textContent = selectedSet.size;
                submitBtn.disabled = (selectedSet.size !== mission.requiredCount);
            });
        });

        submitBtn.addEventListener('click', () => {
            submitBtn.disabled = true;

            let correctCount = 0;
            mission.items.forEach(item => {
                const card = feedList.querySelector(`[data-itemid="${item.itemId}"]`);
                const isSelected = selectedSet.has(item.itemId);
                const explainEl = card.querySelector('.feed-explain');
                explainEl.style.display = 'block';
                explainEl.innerHTML = `💡 <strong>판정 근거:</strong> ${item.feedbackReason}`;

                if (item.isEvidence) {
                    card.classList.add('correct-answer');
                    if (isSelected) correctCount++;
                } else if (isSelected) {
                    card.classList.add('wrong-answer');
                }
            });

            // 점수 반영
            const scoreRatio = correctCount / mission.requiredCount;
            accumulateScores({
                pisa_access: Math.round((mission.scoring.pisa_access || 0) * scoreRatio),
                big6_location_access: Math.round((mission.scoring.big6_location_access || 0) * scoreRatio),
                big6_use_info: Math.round((mission.scoring.big6_use_info || 0) * scoreRatio)
            });

            if (correctCount === mission.requiredCount) {
                SoundEngine.playSuccess();
            } else {
                SoundEngine.playError();
            }

            const feedbackMsg = footerEl.querySelector(`#feedback-msg-${mission.id}`);
            feedbackMsg.innerHTML = correctCount === mission.requiredCount
                ? `<span class="text-success">🎯 정확하게 공식 1차 자료 2건을 선별했습니다!</span>`
                : `<span class="text-warning">⚠️ ${correctCount}개의 핵심 단서를 찾았습니다. 공신력 있는 출처 분별이 중요합니다.</span>`;

            submitBtn.textContent = "단서 분석 완료! 다음 단계로...";
            setTimeout(() => {
                state.currentMissionIdx++;
                loadMission(state.currentMissionIdx);
            }, 1500);
        });
    }

    /* ========================================================
       미션 타입 4 : 팩트체크 판독기 (평가 및 숙고)
       ======================================================== */
    function renderFactChecker(mission) {
        const bodyEl = document.createElement('div');
        bodyEl.className = 'mission-body-container';

        const scannerNotice = document.createElement('div');
        scannerNotice.className = 'scanner-notice-bar';
        scannerNotice.innerHTML = `
            <span>🛡️ <strong>AI 팩트체크 스캐너</strong>: 아래 각 문장의 성격을 비판적으로 분석하여 올바른 유형을 선택하세요.</span>
        `;
        bodyEl.appendChild(scannerNotice);

        const stList = document.createElement('div');
        stList.className = 'statement-list';

        const selections = {};

        mission.statements.forEach((st, sIdx) => {
            const card = document.createElement('div');
            card.className = 'statement-card';
            card.dataset.sid = st.sId;
            card.innerHTML = `
                <div class="st-num">진술 ${sIdx + 1}</div>
                <div class="st-text">${st.text}</div>
                <div class="st-options-row">
                    ${mission.typeOptions.map(opt => `
                        <button type="button" class="btn-st-chip" data-type="${opt.key}">
                            ${opt.label}
                        </button>
                    `).join('')}
                </div>
                <div class="st-feedback-box" style="display:none;"></div>
            `;
            stList.appendChild(card);
        });
        bodyEl.appendChild(stList);

        // 푸터 액션
        const footerEl = document.createElement('div');
        footerEl.className = 'mission-footer-actions';
        footerEl.innerHTML = `
            <div class="submit-feedback-msg" id="feedback-msg-${mission.id}"></div>
            <button type="button" class="btn-action-submit" id="btn-submit-${mission.id}" disabled>
                팩트체크 스캐너 판정 시작 →
            </button>
        `;
        bodyEl.appendChild(footerEl);
        dom.missionContainer.appendChild(bodyEl);

        const submitBtn = footerEl.querySelector(`#btn-submit-${mission.id}`);

        stList.querySelectorAll('.statement-card').forEach(card => {
            const sId = card.dataset.sid;
            card.querySelectorAll('.btn-st-chip').forEach(chip => {
                chip.addEventListener('click', () => {
                    SoundEngine.playClick();
                    card.querySelectorAll('.btn-st-chip').forEach(c => c.classList.remove('active'));
                    chip.classList.add('active');
                    selections[sId] = chip.dataset.type;

                    const allDone = mission.statements.every(item => selections[item.sId] !== undefined);
                    submitBtn.disabled = !allDone;
                });
            });
        });

        submitBtn.addEventListener('click', () => {
            submitBtn.disabled = true;

            let correctCount = 0;
            mission.statements.forEach(st => {
                const card = stList.querySelector(`[data-sid="${st.sId}"]`);
                const userChoice = selections[st.sId];
                const fbBox = card.querySelector('.st-feedback-box');
                fbBox.style.display = 'block';

                const isCorrect = (userChoice === st.correctType);
                if (isCorrect) {
                    correctCount++;
                    card.classList.add('st-correct');
                    fbBox.innerHTML = `✅ <strong>정답!</strong> ${st.reason}`;
                    accumulateScores(mission.scoring.perCorrect);
                } else {
                    card.classList.add('st-wrong');
                    fbBox.innerHTML = `❌ <strong>오답 (정답: ${mission.typeOptions.find(o => o.key === st.correctType).label})</strong><br>${st.reason}`;
                }

                card.querySelectorAll('.btn-st-chip').forEach(chip => {
                    chip.disabled = true;
                });
            });

            if (correctCount === mission.statements.length) {
                SoundEngine.playSuccess();
            } else {
                SoundEngine.playError();
            }

            const feedbackMsg = footerEl.querySelector(`#feedback-msg-${mission.id}`);
            feedbackMsg.innerHTML = `<span class="${correctCount >= 3 ? 'text-success' : 'text-warning'}">
                스캔 완료: 총 ${mission.statements.length}건 중 ${correctCount}건 정확 판정!
            </span>`;

            submitBtn.textContent = "팩트체크 리포트 저장 중...";
            setTimeout(() => {
                state.currentMissionIdx++;
                loadMission(state.currentMissionIdx);
            }, 1800);
        });
    }

    /* ========================================================
       미션 타입 5 : 종합 진실 보고서 & 성찰 (종합 및 메타평가)
       ======================================================== */
    function renderSynthesisReport(mission) {
        const bodyEl = document.createElement('div');
        bodyEl.className = 'mission-body-container';

        const reportSheet = document.createElement('div');
        reportSheet.className = 'synthesis-sheet-card';
        reportSheet.innerHTML = `
            <div class="sheet-title">📑 상록중학교 급식 괴소문 사건 최종 수사 보고서</div>
            <div class="sheet-subtitle">수사관: <strong>${escapeHtml(state.student.name)}</strong> | 소속: 특별 팩트체크 수사대</div>
            <div class="sheet-body">
                ${mission.blanks.map(blank => `
                    <div class="blank-row">
                        <label class="blank-label">${blank.label}</label>
                        <p class="blank-prompt">${blank.promptText}</p>
                        <select class="select-blank" data-bid="${blank.blankId}">
                            <option value="">-- 올바른 결론을 선택하세요 --</option>
                            ${blank.options.map((opt, oIdx) => `
                                <option value="${oIdx}">${opt.text}</option>
                            `).join('')}
                        </select>
                    </div>
                `).join('')}
            </div>
        `;
        bodyEl.appendChild(reportSheet);

        // 성찰 질문
        const ref = mission.reflectionQuestion;
        const refCard = document.createElement('div');
        refCard.className = 'reflection-card';
        refCard.innerHTML = `
            <h4 class="ref-title">🌱 ${ref.question}</h4>
            <div class="ref-options-list">
                ${ref.options.map((opt, rIdx) => `
                    <button type="button" class="btn-ref-option" data-ridx="${rIdx}">
                        <span class="ref-marker">📌</span>
                        <span class="ref-text">${opt.text}</span>
                    </button>
                `).join('')}
            </div>
        `;
        bodyEl.appendChild(refCard);

        // 푸터 액션
        const footerEl = document.createElement('div');
        footerEl.className = 'mission-footer-actions';
        footerEl.innerHTML = `
            <button type="button" class="btn-action-submit final-submit-btn" id="btn-submit-${mission.id}" disabled>
                🎉 사건 종결 및 최종 진단 리포트 열기
            </button>
        `;
        bodyEl.appendChild(footerEl);
        dom.missionContainer.appendChild(bodyEl);

        let selectedRefIdx = null;
        const blankSelects = reportSheet.querySelectorAll('.select-blank');
        const refButtons = refCard.querySelectorAll('.btn-ref-option');
        const submitBtn = footerEl.querySelector(`#btn-submit-${mission.id}`);

        function checkCompletion() {
            const allBlanksSelected = Array.from(blankSelects).every(s => s.value !== "");
            const refSelected = (selectedRefIdx !== null);
            submitBtn.disabled = !(allBlanksSelected && refSelected);
        }

        blankSelects.forEach(sel => {
            sel.addEventListener('change', () => {
                SoundEngine.playClick();
                checkCompletion();
            });
        });

        refButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                SoundEngine.playClick();
                refButtons.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedRefIdx = parseInt(btn.dataset.ridx, 10);
                checkCompletion();
            });
        });

        submitBtn.addEventListener('click', () => {
            submitBtn.disabled = true;

            // 빈칸 채점
            mission.blanks.forEach(blank => {
                const sel = reportSheet.querySelector(`[data-bid="${blank.blankId}"]`);
                const chosenIdx = parseInt(sel.value, 10);
                const chosenOpt = blank.options[chosenIdx];
                if (chosenOpt && chosenOpt.correct) {
                    accumulateScores(mission.scoring.perBlank);
                }
            });

            // 성찰 문항 채점
            const chosenRef = ref.options[selectedRefIdx];
            if (chosenRef && chosenRef.correct) {
                accumulateScores(chosenRef.score);
            }

            SoundEngine.playFanfare();
            finishGame();
        });
    }

    function accumulateScores(delta) {
        if (!delta) return;
        for (const [k, v] of Object.entries(delta)) {
            if (state.scores[k] !== undefined) {
                state.scores[k] += v;
            }
        }
    }

    function finishGame() {
        clearInterval(state.timerInterval);
        state.isCompleted = true;
        state.endTime = new Date();

        dom.screenGame.classList.remove('active');
        dom.screenReport.classList.add('active');

        // 리포트 데이터 산출 및 화면 반영
        const elapsedSecs = Math.max(1, Math.round((state.endTime - state.startTime) / 1000));
        const formattedTime = formatTime(elapsedSecs);

        const finalScores = ReportManager.calculateFinalScores(state.scores);
        const feedback = ReportManager.generateFeedbackAdvice(finalScores);

        // 기본 정보
        dom.reportStudentName.textContent = state.student.name;
        dom.reportTimeElapsed.textContent = formattedTime;

        // PISA 섹션
        const pisa = finalScores.pisa;
        dom.reportPisaBadge.textContent = pisa.levelInfo.badge;
        dom.reportPisaLevelTitle.textContent = pisa.levelInfo.title;
        dom.reportPisaTotalScore.textContent = `${pisa.totalScore}점 / 300점`;
        dom.reportPisaDesc.textContent = pisa.levelInfo.description;

        dom.pisaBarAccess.style.width = `${pisa.access}%`;
        dom.pisaValAccess.textContent = `${pisa.access}점`;

        dom.pisaBarIntegrate.style.width = `${pisa.integrate}%`;
        dom.pisaValIntegrate.textContent = `${pisa.integrate}점`;

        dom.pisaBarEvaluate.style.width = `${pisa.evaluate}%`;
        dom.pisaValEvaluate.textContent = `${pisa.evaluate}점`;

        // Big 6 레이더 차트 렌더링
        setTimeout(() => {
            ReportManager.renderBig6RadarChart('big6-radar-canvas', finalScores.big6);
        }, 100);

        // 강점 및 보완점
        dom.reportStrengthList.innerHTML = feedback.strengths.map(s => `<li>${s}</li>`).join('');
        dom.reportImproveList.innerHTML = feedback.improvements.map(s => `<li>${s}</li>`).join('');
        dom.reportBestSkill.textContent = feedback.bestSkill;
        dom.reportWeakSkill.textContent = feedback.weakSkill;

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function resetGame() {
        clearInterval(state.timerInterval);
        state.scores = {
            pisa_access: 0,
            pisa_integrate: 0,
            pisa_evaluate: 0,
            big6_task_def: 0,
            big6_seeking_strat: 0,
            big6_location_access: 0,
            big6_use_info: 0,
            big6_synthesis: 0,
            big6_evaluation: 0
        };

        dom.screenReport.classList.remove('active');
        dom.screenGame.classList.remove('active');
        dom.screenIntro.classList.add('active');

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}분 ${s}초`;
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    return {
        init
    };

})();

// DOM 준비 시 엔진 초기화
document.addEventListener('DOMContentLoaded', () => {
    GameEngine.init();
});
