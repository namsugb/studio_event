interface KakaoNotificationData {
    name: string;
    phone: string;
    date: string;
    time: string;
    shootingType: string;
    people: number;
    referralSources?: string[];
}

// 스튜디오에 보내는 알림톡
export async function sendKakaoNotification(data: KakaoNotificationData) {
    try {
        // Lunasoft API 설정 확인
        const LUNA_USERID = process.env.LUNA_USERID;
        const LUNA_API_KEY = process.env.LUNA_API_KEY;
        const LUNA_TEMPLATE_CODE = process.env.LUNA_TEMPLATE_CODE;

        if (!LUNA_USERID || !LUNA_API_KEY || !LUNA_TEMPLATE_CODE) {
            console.warn("Lunasoft 알림톡 설정이 되어있지 않습니다.");
            return { success: false, error: "Lunasoft configuration missing" };
        }

        const referralInfo = data.referralSources && data.referralSources.length > 0
            ? `\n유입경로 : ${data.referralSources.join(", ")}`
            : "";

        const requestBody = {
            userid: LUNA_USERID,
            api_key: LUNA_API_KEY,
            template_id: LUNA_TEMPLATE_CODE,
            messages: [
                {
                    no: "1",
                    tel_num: "01089300045",
                    use_sms: "0",
                    sms_content: "아침햇살 스튜디오 예약 문의",
                    msg_content: `아침햇살 스튜디오님\n새로운 예약문의가 있습니다.\n\n-고객정보\n이름 : ${data.name}\n연락처 : ${data.phone}\n촬영유형 : ${data.shootingType}\n촬영일시 : ${data.date}`,
                },
            ],
        }

        console.log("API 요청 데이터:", JSON.stringify(requestBody, null, 2));

        // Lunasoft API 요청
        const response = await fetch("https://jupiter.lunasoft.co.kr/api/AlimTalk/message/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("API 응답 데이터:", JSON.stringify(result, null, 2));

        // Lunasoft API 응답 처리
        if (result.code !== 0) {
            const errorMessage = typeof result.msg === 'object'
                ? JSON.stringify(result.msg, null, 2)
                : result.msg || "알림톡 전송 실패";
            throw new Error(errorMessage);
        }

        return { success: true, data: result };
    } catch (error: any) {
        console.error("알림톡 전송 중 오류:", error);
        return { success: false, error: error.message };
    }
}


// 고객에게 보내는 알림톡
export async function sendKakaoNotificationToCustomer(data: KakaoNotificationData) {
    try {
        // Lunasoft API 설정 확인
        const LUNA_USERID = process.env.LUNA_USERID;
        const LUNA_API_KEY = process.env.LUNA_API_KEY;
        const LUNA_TEMPLATE_CODE = 50037;

        if (!LUNA_USERID || !LUNA_API_KEY || !LUNA_TEMPLATE_CODE) {
            console.warn("Lunasoft 알림톡 설정이 되어있지 않습니다.");
            return { success: false, error: "Lunasoft configuration missing" };
        }

        const phoneNumber = data.phone.replace(/-/g, '');
        const studio = "아침햇살 스튜디오";

        const requestBody = {
            userid: LUNA_USERID,
            api_key: LUNA_API_KEY,
            template_id: LUNA_TEMPLATE_CODE,
            messages: [
                {
                    no: "1",
                    tel_num: phoneNumber,
                    use_sms: "0",
                    sms_content: "아침햇살 스튜디오 예약 문의",
                    msg_content: `[${studio}]\n안녕하세요 ${data.name}님 예약 문의 주셔서 감사합니다.\n 곧 상담 연락을 드리겠습니다.궁금하신점이 있으시면 언제든 물어보세요`
                },
            ],
        }


        console.log("API 요청 데이터:", JSON.stringify(requestBody, null, 2));

        // Lunasoft API 요청
        const response = await fetch("https://jupiter.lunasoft.co.kr/api/AlimTalk/message/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("API 응답 데이터:", JSON.stringify(result, null, 2));

        // Lunasoft API 응답 처리
        if (result.code !== 0) {
            const errorMessage = typeof result.msg === 'object'
                ? JSON.stringify(result.msg, null, 2)
                : result.msg || "알림톡 전송 실패";
            throw new Error(errorMessage);
        }

        return { success: true, data: result };
    } catch (error: any) {
        console.error("알림톡 전송 중 오류:", error);
        return { success: false, error: error.message };
    }
}
