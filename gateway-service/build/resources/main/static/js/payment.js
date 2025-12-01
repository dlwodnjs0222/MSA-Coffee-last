window.addEventListener("DOMContentLoaded", () => {
    const amountInput = document.getElementById("amount");
    const methodSelect = document.getElementById("method");
    const paymentBtn = document.getElementById("payment-btn");
    const modal = document.getElementById("paymentModal");
    const modalMessage = document.getElementById("modalMessage");
    const closeBtn = document.querySelector("#paymentModal .close");

    // localStorage에서 금액 불러오기
    const savedAmount = localStorage.getItem("paymentAmount");
    if (savedAmount) amountInput.value = savedAmount;

    paymentBtn.addEventListener("click", async () => {
        const amount = parseFloat(amountInput.value);
        const method = methodSelect.value;
        const orderId = localStorage.getItem("lastOrderId"); // 주문 ID 가져오기
        if (!orderId) return alert("주문이 확인되지 않았습니다.");

        if (!amount || amount <= 0) {
            alert("금액을 입력해주세요.");
            return;
        }

        // 항상 SUCCESS로 설정
        const paymentData = { orderId, amount, method, status: "SUCCESS" };

        try {
            const response = await fetch("http://localhost:8000/api/payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(paymentData)
            });

            if (response.ok) {
                const result = await response.json();
                modalMessage.innerHTML = `
                    결제 성공!<br>
                    금액: ${amount.toLocaleString()}원<br>
                    결제 수단: ${method}<br>
                    거래 ID: ${result.id || "-"}
                `;
                modal.style.display = "block";

                localStorage.removeItem('cart');
                localStorage.removeItem('paymentAmount');
                localStorage.removeItem('lastOrderId');

                setTimeout(() => { window.location.href = 'http://localhost:8000/orders'; }, 1500);

            } else {
                const errorText = await response.text();
                modalMessage.innerHTML = `
                    결제 실패!<br>
                    금액: ${amount.toLocaleString()}원<br>
                    결제 수단: ${method}<br>
                    이유: ${errorText || "알 수 없음"}
                `;
                modal.style.display = "block";
            }
        } catch (error) {
            modalMessage.innerHTML = `결제 실패!<br>오류: ${error.message}`;
            modal.style.display = "block";
        }
    });

    closeBtn.addEventListener("click", () => { modal.style.display = "none"; });
    window.addEventListener("click", (event) => { if (event.target === modal) modal.style.display = "none"; });
});
