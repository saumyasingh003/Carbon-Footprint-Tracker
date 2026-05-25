import genAI from "../config/gemini.js";

export const generateNotificationMessage =
    async ({
        eventType,
        category,
        type,
        carbonEmission,
        totalEmission,
        ecoScore,
        previousMessages = [],
    }) => {

        try {

            const model =
                genAI.getGenerativeModel({
                    model: "gemini-2.5-flash",
                });

            // RANDOM TONES
            const tones = [
                "professional",
                "motivational",
                "friendly",
                "eco-conscious",
                "data-driven",
                "minimal",
                "analytical",
                "premium",
                "modern SaaS",
            ];

            const randomTone =
                tones[
                Math.floor(
                    Math.random() *
                    tones.length
                )
                ];

            // RANDOM STRUCTURES
            const structures = [
                "short",
                "medium",
                "detailed",
                "2-line",
                "3-line",
                "premium",
            ];

            const randomStructure =
                structures[
                Math.floor(
                    Math.random() *
                    structures.length
                )
                ];

            // RANDOM TITLE STYLES
            const titleStyles = [
                "modern",
                "minimal",
                "eco-tech",
                "premium",
                "motivational",
                "alert-style",
            ];

            const randomTitleStyle =
                titleStyles[
                Math.floor(
                    Math.random() *
                    titleStyles.length
                )
                ];

            // PREVIOUS MESSAGES
            const recentMessages =
                previousMessages.length > 0
                    ? previousMessages.join("\n")
                    : "No previous notifications.";

            let prompt = "";

            // HIGH EMISSION
            if (
                eventType === "high_emission"
            ) {

                prompt = `
You are an AI sustainability notification engine.

Generate a UNIQUE high-emission warning.

Tone:
${randomTone}

User Activity:
Category: ${category}
Type: ${type}

Carbon Emission:
${carbonEmission} kg CO₂

Total User Emission:
${totalEmission} kg CO₂

Previous Notifications:
${recentMessages}

STRICT RULES:
- Do NOT repeat previous wording
- Sound modern and intelligent
- Include eco-friendly advice
- Avoid generic lines
`;
            }

            // GOAL WARNING
            else if (
                eventType === "goal_warning"
            ) {

                prompt = `
Generate a UNIQUE carbon goal warning notification.

Tone:
${randomTone}

User Total Emission:
${totalEmission} kg CO₂

Previous Notifications:
${recentMessages}

STRICT RULES:
- Warn user politely
- Encourage sustainable action
- Avoid repetition
`;
            }

            // GOAL ACHIEVED
            else if (
                eventType === "goal_achieved"
            ) {

                prompt = `
Generate a UNIQUE sustainability achievement notification.

Tone:
${randomTone}

Eco Score:
${ecoScore}

Previous Notifications:
${recentMessages}

STRICT RULES:
- Celebrate achievement
- Sound premium and modern
`;
            }

            // ECO IMPROVED
            else if (
                eventType === "eco_improved"
            ) {

                prompt = `
Generate a UNIQUE eco score improvement message.

Tone:
${randomTone}

New Eco Score:
${ecoScore}

Previous Notifications:
${recentMessages}

STRICT RULES:
- Congratulate user
- Sound inspiring
`;
            }

            // UNUSUAL ACTIVITY
            else if (
                eventType === "unusual_activity"
            ) {

                prompt = `
Generate a UNIQUE unusual activity alert.

Tone:
${randomTone}

Current Total Emission:
${totalEmission} kg CO₂

Previous Notifications:
${recentMessages}

STRICT RULES:
- Mention emission spike
- Add actionable advice
`;
            }

            // WEEKLY SUMMARY
            else if (
                eventType === "weekly_summary"
            ) {

                prompt = `
Generate a UNIQUE weekly sustainability summary.

Tone:
${randomTone}

Weekly Emission:
${totalEmission} kg CO₂

Previous Notifications:
${recentMessages}

STRICT RULES:
- Mention trends
- Give eco insight
`;
            }

            // STREAK
            else if (
                eventType === "streak"
            ) {

                prompt = `
Generate a UNIQUE eco streak achievement notification.

Tone:
${randomTone}

Previous Notifications:
${recentMessages}

STRICT RULES:
- Sound rewarding
- Mention consistency
`;
            }

            // FORECAST
            else if (
                eventType === "forecast"
            ) {

                prompt = `
Generate a UNIQUE future carbon forecast warning.

Tone:
${randomTone}

Projected Emission:
${totalEmission} kg CO₂

Previous Notifications:
${recentMessages}

STRICT RULES:
- Mention future risk
- Suggest reduction strategy
`;
            }

            // DEFAULT RECOMMENDATION
            else {

                prompt = `
Generate a UNIQUE sustainability recommendation.

Tone:
${randomTone}

Category:
${category}

Previous Notifications:
${recentMessages}

STRICT RULES:
- Give smart eco advice
- Sound modern
- Avoid repeated wording
`;
            }

            // FINAL FORMAT RULES
            prompt += `

ADDITIONAL FORMAT RULES:

Generate notification in EXACT format:

TITLE:
<unique title>

MESSAGE:
<message>

IMPORTANT:
- Every response MUST have a different title
- Never reuse old wording
- Sometimes write 1 short line
- Sometimes write 2-3 lines
- Sometimes make it premium SaaS style
- Sometimes make it analytical
- Sometimes make it emotional
- Sometimes make it ultra minimal

Current structure style:
${randomStructure}

Current title style:
${randomTitleStyle}

Examples of title styles:
- Carbon Pulse
- Emission Drift
- Eco Momentum
- Climate Insight
- Green Shift
- Environmental Forecast
- Sustainability Signal

DO NOT COPY THESE EXACTLY.
Generate completely new ones.
`;

            // GEMINI RESPONSE
            const result = await model.generateContent({
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: prompt,
                            },
                        ],
                    },
                ],
                generationConfig: {
                    temperature: 1.5,
                    topP: 0.95,
                    topK: 64,
                },
            });

            const response = await result.response;
            const rawText = response.text().trim();

            // DEFAULT VALUES
            let title = "AI Sustainability Insight";
            let message = rawText;

            // EXTRACT TITLE
            const titleMatch = rawText.match(/TITLE:\s*(.*)/i);
            // EXTRACT MESSAGE
            const messageMatch = rawText.match(/MESSAGE:\s*([\s\S]*)/i);

            if (titleMatch) {
                title = titleMatch[1].trim();
            }
            if (messageMatch) {
                message = messageMatch[1].trim();
            }

            // CLEANUP
            title = title.replace(/\*\*/g, "").replace(/"/g, "").trim();
            message = message.replace(/\*\*/g, "").replace(/"/g, "").trim();

            // FINAL RETURN
            return {
                title,
                message,
            };

        } catch (error) {
            console.log("Gemini Error:", error.message);

            const fallbackNotifications = {
                transport: [
                    { title: "Eco-Transit Boost 🚲", message: "Splendid choice! Choosing green travel reduces air pollution and local road congestion." },
                    { title: "Carbon-Light Travel 🌿", message: "Every kilometer walked or cycled keeps the air clean. Keep up this beautiful trend!" },
                    { title: "Green Commuter ⚡", message: "Opting for shared or low-carbon transit cuts emissions by up to 50%. You are making a huge difference!" },
                    { title: "Eco-Wheels Motion 🚗", message: "Consider carpooling or batching errands to minimize fuel emissions. Small steps count!" },
                ],
                electricity: [
                    { title: "Grid Optimizer 🔌", message: "Unplugging phantom loads and using energy-efficient appliances keeps the grid stable and clean." },
                    { title: "Watts Down 🌱", message: "Conserving energy is a quiet superpower. You are lowering the demand for fossil fuels!" },
                    { title: "Power-Saving Mode 💡", message: "Turning off unused lights and switching to LED helps reduce greenhouse gases instantly." },
                    { title: "Solar Spirit ☀️", message: "Mindful electricity consumption matches your sustainable energy goals perfectly." },
                ],
                food: [
                    { title: "Plate Power 🥗", message: "Sustainable dining options like plant-based meals are highly effective for reducing carbon." },
                    { title: "Eco-Gastronomy 🍎", message: "Choosing local and seasonal ingredients lowers transport emissions and supports the community." },
                    { title: "Conscious Kitchen 🥦", message: "Minimizing food waste saves water, energy, and avoids landfill methane emissions." },
                    { title: "Green Recipe 🍃", message: "Every plant-focused choice is a love letter to our ecosystems. Spectacular job!" },
                ],
                waste: [
                    { title: "Zero-Waste Vibe ♻️", message: "Composting or recycling prevents valuable materials from ending up in local landfills." },
                    { title: "Circular Economy 📦", message: "Reusing items and choosing minimal packaging helps build a sustainable future." },
                    { title: "De-clutter Earth 🗑️", message: "Proper segregation of plastic and electronic waste keeps toxins out of the ground." },
                    { title: "Resource Guardian 🌍", message: "By choosing conscious waste management, you preserve vital natural resources." },
                ],
                water: [
                    { title: "H2O Conscious 💧", message: "Shortening showers and turning off running taps preserves precious clean water resources." },
                    { title: "Blue Planet Care 🌊", message: "Conserving water reduces energy used at water treatment facilities. Great job!" },
                    { title: "Water Drop Hero 🚿", message: "Every gallon saved helps aquatic ecosystems thrive. You are a water steward!" },
                ],
                shopping: [
                    { title: "Mindful Purchase 🛍️", message: "Choosing durable items over fast fashion reduces resource strain and waste." },
                    { title: "Green Cart 🛒", message: "Buying eco-certified products encourages brands to follow sustainable practices." },
                    { title: "Eco-Consumerism 🏷️", message: "Less is more. Your conscious shopping habits help protect global biodiversity." },
                ],
                default: [
                    { title: "Sustainability Pulse 📈", message: "You are actively tracking and reducing your carbon footprint. Every step is progress!" },
                    { title: "Eco Guardian 🌳", message: "Logging your footprint is the first step towards a greener, healthier planet." },
                    { title: "Carbon Balance ⚖️", message: "Balanced lifestyle habits help align our daily actions with the Earth's natural cycles." },
                    { title: "Green Horizon ✨", message: "Stay inspired and keep building sustainable habits. Your future self will thank you!" },
                ]
            };

            const normalizedCat = (category || "").toLowerCase().trim();
            const options = fallbackNotifications[normalizedCat] || fallbackNotifications.default;
            const randomChoice = options[Math.floor(Math.random() * options.length)];
            return randomChoice;
        }
    };





















