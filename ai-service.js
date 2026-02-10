/**
 * LifeFix AI Service - Hybrid Edition
 * Handles local math, keyword matching, and advanced Gemini API logic.
 */

const AIService = {
    // --- Configuration ---
    getApiKey: () => localStorage.getItem("gemini_api_key") || "",
    setApiKey: (key) => localStorage.setItem("gemini_api_key", key),

    UNIVERSAL_SYSTEM_PROMPT: `คุณคือ "พี่หุ่นยนต์ LifeFix" ผู้ช่วยอัจฉริยะที่เชี่ยวชาญทั้งการแก้ปัญหาชีวิต, คณิตศาสตร์ และการเขียนโปรแกรม

หน้าที่ของคุณ:
1. เป็นที่ปรึกษา: ให้คำแนะนำเรื่องปัญหาชีวิตและการเรียนด้วยพลังบวก
2. เป็นครูคณิต: แก้สมการและอธิบายขั้นตอนการคำนวณอย่างชัดเจน
3. เป็นโค้ดเดอร์: เขียนโค้ดตัวอย่าง (Python, HTML, JS) และอธิบายการทำงาน

กฎเหล็ก:
- หากเป็นโจทย์เลข ให้แสดงวิธีทำเป็นลำดับขั้นตอน
- หากเป็นเรื่องโค้ด ให้ใช้ Markdown Code Block (เช่น \`\`\`python)
- ใช้ภาษาที่เข้าใจง่าย เป็นมิตร เหมือนพี่สอนน้อง`,

    // --- Gemini API Caller ---
    async callGemini(prompt, history = []) {
        const apiKey = this.getApiKey();
        if (!apiKey) return null;

        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const combinedPrompt = `[MODE: HYBRID ASSISTANT]\n[INSTRUCTION]: ${this.UNIVERSAL_SYSTEM_PROMPT}\n\n[USER]: ${prompt}`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ role: "user", parts: [{ text: combinedPrompt }] }]
                })
            });
            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
        } catch (e) {
            console.error("Gemini Error:", e);
            return null;
        }
    },

    // --- Math Engine (Local) ---
    calculateMath(query) {
        // Clean query for math: 5 + 5, 2^10, x + 2 = 10
        let q = query.replace(/เท่ากับเท่าไหร่|ได้เท่าไหร่|= \?|\?/g, "").trim();

        // 1. Simple Equation Solving (e.g., x + 5 = 10)
        const eqMatch = q.match(/([a-zA-Z])\s*([\+\-\*\/])\s*(\d+)\s*=\s*(\d+)/);
        if (eqMatch) {
            const [_, variable, op, n1, result] = eqMatch;
            const num1 = parseFloat(n1);
            const res = parseFloat(result);
            let finalValue;
            if (op === "+") finalValue = res - num1;
            if (op === "-") finalValue = res + num1;
            if (op === "*") finalValue = res / num1;
            if (op === "/") finalValue = res * num1;
            return `พี่แก้สมการให้แล้วครับ! จาก ${variable} ${op} ${n1} = ${result}\nจะได้ ${variable} = ${finalValue} ครับผม 🧠`;
        }

        // 2. Arithmetic (e.g., 5 * 10 / 2)
        try {
            // Replace ^ with ** for JS eval
            let expression = q.replace(/\^/g, "**").replace(/[^-()\d/*+. ]/g, "");
            if (expression && /[\+\-\*\/\*\*]/.test(expression)) {
                const result = eval(expression);
                return `คำนวณให้แล้วจ้า: ${q} = ${result} ครับ! ✨`;
            }
        } catch (e) { }

        return null;
    },
    /**
     * Unified Solve Method
     */
    async solve(query, category, knowledgeBase) {
        const lowerQ = query.toLowerCase();

        // 1. Check Crisis
        if (/(ตาย|ฆ่าตัวตาย|ทำร้ายตัวเอง|ไม่ไหวแล้ว|สิ้นหวัง)/i.test(lowerQ)) {
            return { text: "พี่รับรู้ว่าน้องกำลังลำบากใจครับ พี่อยากให้ลองคุยกับสายด่วนสุขภาพจิต 1323 นะครับ มีคนพร้อมรับฟังเสมอนะ 💚 พี่เชื่อว่าทุกอย่างมีทางออกครับ!" };
        }

        // 2. Local Math Check
        const mathResult = this.calculateMath(query);
        if (mathResult) return { text: mathResult };

        // 3. Optional Gemini for Code/Complex Questions
        const apiKey = this.getApiKey();
        const isComplex = /(โค้ด|code|เขียนโปรแกรม|ภาษา|สมการ|ฟิสิกส์|เคมี|วิเคราะห์)/i.test(lowerQ);

        if (apiKey && (isComplex || lowerQ.length > 20)) {
            const aiResp = await this.callGemini(query);
            if (aiResp) return { text: aiResp };
        }

        // 4. Semantic Fallback (Keywords)
        return this.analyzeSemantic(query, category, knowledgeBase);
    },

    analyzeSemantic(query, category, knowledgeBase) {
        const lowerQ = query.toLowerCase();
        let bestMatch = null;
        let maxScore = 0;

        knowledgeBase.forEach(item => {
            let score = 0;
            item.keywords.forEach(k => {
                if (lowerQ.includes(k.toLowerCase())) score += 2;
            });
            if (item.category === category) score += 1;
            if (score > maxScore) {
                maxScore = score;
                bestMatch = item;
            }
        });

        if (maxScore > 1.2 && bestMatch) {
            const resp = bestMatch.response;
            const text = Array.isArray(resp) ? resp[Math.floor(Math.random() * resp.length)] : resp;

            let result = { text: text };

            // Check for category mismatch
            if (bestMatch.category !== "general" && bestMatch.category !== category) {
                result.redirect = { cat: bestMatch.category };

                // Smart Problem Detection: If a keyword matches a problem title, suggest detail.html
                const problemMatch = bestMatch.keywords.find(k => k.length > 3 && lowerQ.includes(k.toLowerCase()));
                if (problemMatch) {
                    result.redirect.problem = problemMatch;
                }
            }
            return result;
        }

        // Proactive suggestions for math/code if user is lost
        if (/(เลข|คณิต|คำนวณ|บวก|ลบ)/.test(lowerQ)) return { text: "ถามโจทย์เลขพี่ได้นะ เช่น '5 + 25 * 2' หรือ 'x + 10 = 30' พี่ช่วยคำนวณให้ได้ครับ!" };
        if (/(โค้ด|เขียนโปรแกรม|ไพทอน|html)/.test(lowerQ)) return { text: "อยากให้พี่ช่วยเขียนโค้ดภาษาไหนบอกได้เลยนะ! (อย่าลืมใส่ Gemini API Key ในตั้งค่าเพื่อให้พี่ประมวลผลได้เก่งขึ้นนะครับ)" };

        return { text: "ขอโทษทีจ้า พี่หุ่นยนต์ยังไม่เข้าใจข้อมูลส่วนนี้ ลองพิมพ์คำที่ชัดเจนขึ้น หรือถามเป็นโจทย์เลขก็ได้นะ!" };
    }
};
