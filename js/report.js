/**
 * report.js - PISA 문해력 및 Big 6 Skills 분석 알고리즘과 Canvas 시각화 리포트
 */

const ReportManager = (function() {

    // PISA 공식 성취수준 6단계 정의
    const PISA_LEVELS = [
        {
            level: 6,
            minScore: 260,
            title: "LEVEL 6 (마스터 팩트체커)",
            badge: "🏆 수석 프로파일러",
            description: "복합적인 가짜뉴스와 정교한 편향을 날카롭게 꿰뚫어 보며, 다각적인 출처를 완벽하게 교차 검증하고 비판적으로 숙고할 수 있는 최상위 수준의 문해력을 갖추었습니다."
        },
        {
            level: 5,
            minScore: 220,
            title: "LEVEL 5 (고급 수사관)",
            badge: "🎖️ 특수 수사관",
            description: "상반된 여러 문서 사이의 미묘한 논리적 모순을 훌륭히 찾아내고, 정보원의 신뢰성을 주도적으로 평가하여 합리적인 결론을 도출하는 우수한 역량을 보입니다."
        },
        {
            level: 4,
            minScore: 180,
            title: "LEVEL 4 (유능한 분석관)",
            badge: "⭐ 전문 분석관",
            description: "다양한 자료 속에서 핵심 사실을 명확히 추출하고 맥락을 파악할 수 있으며, 전형적인 허위 정보와 과장된 주장을 안정적으로 구별해냅니다."
        },
        {
            level: 3,
            minScore: 140,
            title: "LEVEL 3 (기본 탐정)",
            badge: "🔍 주니어 수사관",
            description: "명시적으로 주어진 직접적인 정보는 잘 찾아내지만, 여러 출처의 정보를 깊이 있게 교차 대조하거나 복합적인 텍스트의 행간을 파악하는 연습이 필요합니다."
        },
        {
            level: 2,
            minScore: 100,
            title: "LEVEL 2 (기초 탐색자)",
            badge: "🌱 수습 수사관",
            description: "단순한 사실 관계를 파악하는 기초 문해력은 갖추었으나, 자극적인 제목이나 조회수에 영향을 받지 않고 출처의 객관성을 먼저 따져보는 비판적 독해 훈련이 권장됩니다."
        },
        {
            level: 1,
            minScore: 0,
            title: "LEVEL 1 (디딤돌 단계)",
            badge: "📖 문해력 비기너",
            description: "인터넷 소문이나 자극적 주장에 쉽게 휩쓸릴 수 있습니다. 글의 핵심 키워드를 차분히 짚어보고 출처가 어디인지 확인하는 기초 정보 탐색 습관 형성이 필요합니다."
        }
    ];

    /**
     * 원시 점수 객체를 100점 만점 단위로 정규화
     */
    function calculateFinalScores(rawScores) {
        // 최대 기대치 기준 (quests.js 배점 기반 정규화)
        // PISA: access (최대 50), integrate (최대 65), evaluate (최대 125) -> 각 100점 만점으로 환산
        const pisaAccess = Math.min(100, Math.round(((rawScores.pisa_access || 0) / 50) * 100));
        const pisaIntegrate = Math.min(100, Math.round(((rawScores.pisa_integrate || 0) / 65) * 100));
        const pisaEvaluate = Math.min(100, Math.round(((rawScores.pisa_evaluate || 0) / 125) * 100));
        const pisaTotal = Math.round((pisaAccess + pisaIntegrate + pisaEvaluate)); // 300점 만점

        // Big 6 Skills (각 100점 만점으로 정규화)
        // task_def: 50 max -> *2
        const b1_task = Math.min(100, Math.round(((rawScores.big6_task_def || 0) / 50) * 100));
        // seeking_strat: 50 max -> *2
        const b2_seek = Math.min(100, Math.round(((rawScores.big6_seeking_strat || 0) / 50) * 100));
        // location_access: 50 max -> *2
        const b3_loc = Math.min(100, Math.round(((rawScores.big6_location_access || 0) / 50) * 100));
        // use_info: 100 max
        const b4_use = Math.min(100, Math.round(((rawScores.big6_use_info || 0) / 100) * 100));
        // synthesis: 70 max
        const b5_synth = Math.min(100, Math.round(((rawScores.big6_synthesis || 0) / 70) * 100));
        // evaluation: 100 max
        const b6_eval = Math.min(100, Math.round(((rawScores.big6_evaluation || 0) / 100) * 100));

        // PISA 레벨 결정
        let pisaLevelObj = PISA_LEVELS[PISA_LEVELS.length - 1];
        for (const lvl of PISA_LEVELS) {
            if (pisaTotal >= lvl.minScore) {
                pisaLevelObj = lvl;
                break;
            }
        }

        return {
            pisa: {
                access: pisaAccess,
                integrate: pisaIntegrate,
                evaluate: pisaEvaluate,
                totalScore: pisaTotal,
                maxScore: 300,
                percent: Math.round((pisaTotal / 300) * 100),
                levelInfo: pisaLevelObj
            },
            big6: {
                task_def: b1_task,
                seeking_strat: b2_seek,
                location_access: b3_loc,
                use_info: b4_use,
                synthesis: b5_synth,
                evaluation: b6_eval,
                average: Math.round((b1_task + b2_seek + b3_loc + b4_use + b5_synth + b6_eval) / 6)
            }
        };
    }

    /**
     * Big 6 Skills 6각 레이더 차트를 HTML5 Canvas에 렌더링
     */
    function renderBig6RadarChart(canvasId, big6Data) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        // 캔버스 레티나 해상도 보정
        const rect = canvas.getBoundingClientRect();
        const displayWidth = rect.width || 380;
        const displayHeight = rect.height || 340;

        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
        ctx.scale(dpr, dpr);

        const centerX = displayWidth / 2;
        const centerY = displayHeight / 2 + 10;
        const radius = Math.min(displayWidth, displayHeight) * 0.36;

        const categories = [
            { key: 'task_def', label: '1. 과제 정의' },
            { key: 'seeking_strat', label: '2. 탐색 전략' },
            { key: 'location_access', label: '3. 위치/접근' },
            { key: 'use_info', label: '4. 정보 활용' },
            { key: 'synthesis', label: '5. 종합/통합' },
            { key: 'evaluation', label: '6. 평가/성찰' }
        ];

        const totalAxes = categories.length;
        const angleStep = (Math.PI * 2) / totalAxes;

        ctx.clearRect(0, 0, displayWidth, displayHeight);

        // 1. 동심원 다각형 그리드 그리기 (20%, 40%, 60%, 80%, 100%)
        const gridSteps = 5;
        for (let i = 1; i <= gridSteps; i++) {
            const currentRadius = (radius / gridSteps) * i;
            ctx.beginPath();
            for (let j = 0; j < totalAxes; j++) {
                const angle = j * angleStep - Math.PI / 2;
                const x = centerX + currentRadius * Math.cos(angle);
                const y = centerY + currentRadius * Math.sin(angle);
                if (j === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.strokeStyle = i === gridSteps ? 'rgba(74, 222, 128, 0.4)' : 'rgba(255, 255, 255, 0.12)';
            ctx.lineWidth = i === gridSteps ? 1.5 : 1;
            ctx.stroke();

            // 단계 눈금 레이블 (상단 축)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
            ctx.font = '10px sans-serif';
            ctx.fillText(`${i * 20}`, centerX + 4, centerY - currentRadius + 10);
        }

        // 2. 방사형 축 선 및 카테고리 레이블 그리기
        categories.forEach((cat, idx) => {
            const angle = idx * angleStep - Math.PI / 2;
            const endX = centerX + radius * Math.cos(angle);
            const endY = centerY + radius * Math.sin(angle);

            // 축 선
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
            ctx.stroke();

            // 라벨 위치 계산 (조금 바깥으로)
            const labelDist = radius + 24;
            const lx = centerX + labelDist * Math.cos(angle);
            const ly = centerY + labelDist * Math.sin(angle);

            ctx.fillStyle = '#e2e8f0';
            ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // 점수 표시
            const scoreVal = big6Data[cat.key] || 0;
            ctx.fillText(cat.label, lx, ly - 7);
            ctx.fillStyle = '#38bdf8';
            ctx.font = '11px sans-serif';
            ctx.fillText(`${scoreVal}점`, lx, ly + 9);
        });

        // 3. 학생 데이터 다각형 그리기
        ctx.beginPath();
        const dataPoints = [];

        categories.forEach((cat, idx) => {
            const score = big6Data[cat.key] || 0;
            const r = (score / 100) * radius;
            const angle = idx * angleStep - Math.PI / 2;
            const px = centerX + r * Math.cos(angle);
            const py = centerY + r * Math.sin(angle);

            dataPoints.push({ x: px, y: py });

            if (idx === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        });
        ctx.closePath();

        // 영역 채우기 그라데이션
        const gradient = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, radius);
        gradient.addColorStop(0, 'rgba(56, 189, 248, 0.6)');
        gradient.addColorStop(1, 'rgba(129, 140, 248, 0.25)');
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // 4. 데이터 꼭짓점 발광 점 찍기
        dataPoints.forEach(pt => {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.strokeStyle = '#0284c7';
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    }

    /**
     * 학생 맞춤형 강점/보완점 피드백 텍스트 생성
     */
    function generateFeedbackAdvice(scores) {
        const { pisa, big6 } = scores;
        const strengths = [];
        const improvements = [];

        // PISA 영역 진단
        if (pisa.access >= 80) strengths.push("텍스트에서 중요한 핵심 정보와 적절한 검색어를 신속하게 찾아내는 감각이 뛰어납니다.");
        else improvements.push("방대한 글을 마주했을 때 핵심 키워드를 먼저 메모하고 검색어를 조합하는 연습을 해보세요.");

        if (pisa.integrate >= 80) strengths.push("서로 다른 출처의 글을 비교하고 사건의 인과관계를 논리적으로 꿰맞추는 독해력이 탁월합니다.");
        else improvements.push("하나의 글만 보고 단정하기보다 여러 사람의 증언이나 자료를 맞비교해보는 습관을 기르면 좋습니다.");

        if (pisa.evaluate >= 80) strengths.push("가짜뉴스의 왜곡된 수법이나 자극적인 낚시성 문구를 비판적으로 간파하는 눈이 매우 예리합니다.");
        else improvements.push("댓글 수나 자극적인 캡션에 현혹되지 않고, '이 정보의 공식 출처가 어디인가?'를 먼저 확인하는 연습이 필요합니다.");

        // Big 6 강점 파악
        const big6Entries = Object.entries(big6).filter(([k]) => k !== 'average');
        big6Entries.sort((a, b) => b[1] - a[1]);
        const highestSkill = big6Entries[0];
        const lowestSkill = big6Entries[big6Entries.length - 1];

        const skillNames = {
            task_def: "과제 정의(문제 파악)",
            seeking_strat: "정보 탐색 전략",
            location_access: "위치 파악 및 신뢰성 선별",
            use_info: "정보 활용 및 가치 분석",
            synthesis: "종합 및 통합 보고서 작성",
            evaluation: "메타인지 평가 및 성찰"
        };

        return {
            strengths: strengths.length ? strengths : ["성실하게 5단계 수사 과정을 완수하며 기본적인 정보 처리 과정을 경험했습니다."],
            improvements: improvements.length ? improvements : ["전 영역에서 매우 균형 잡힌 우수한 리터러시를 발휘했습니다. 지속적으로 시사 뉴스나 칼럼을 비판적으로 읽어보세요."],
            bestSkill: `${skillNames[highestSkill[0]]} (${highestSkill[1]}점)`,
            weakSkill: `${skillNames[lowestSkill[0]]} (${lowestSkill[1]}점)`
        };
    }

    /**
     * 교사용 CSV 데이터 내보내기 (엑셀 호환 UTF-8 BOM)
     */
    function exportResultsToCSV(studentInfo, scores, timeElapsedFormatted) {
        const bom = "\uFEFF";
        let csv = "이름,학교/학년,소요시간,PISA_총점,PISA_레벨,PISA_정보접근,PISA_이해통합,PISA_평가숙고,Big6_평균,Big6_과제정의,Big6_탐색전략,Big6_위치접근,Big6_정보활용,Big6_종합통합,Big6_평가성찰,진단일시\n";

        const now = new Date().toLocaleString();
        const row = [
            `"${studentInfo.name || '무명 수사관'}"`,
            `"${studentInfo.gradeClass || '미기재'}"`,
            `"${timeElapsedFormatted}"`,
            scores.pisa.totalScore,
            `"${scores.pisa.levelInfo.title}"`,
            scores.pisa.access,
            scores.pisa.integrate,
            scores.pisa.evaluate,
            scores.big6.average,
            scores.big6.task_def,
            scores.big6.seeking_strat,
            scores.big6.location_access,
            scores.big6.use_info,
            scores.big6.synthesis,
            scores.big6.evaluation,
            `"${now}"`
        ];

        csv += row.join(",") + "\n";

        const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `수사결과_${studentInfo.name || '학생'}_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return {
        calculateFinalScores,
        renderBig6RadarChart,
        generateFeedbackAdvice,
        exportResultsToCSV
    };

})();
