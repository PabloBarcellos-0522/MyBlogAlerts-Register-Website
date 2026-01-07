"use strict"

const API_BASE_URL = "https://tame-showers-dance.loca.lt/"

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form")
    const registerMatriculaInput = document.getElementById("register-matricula")
    const registerPasswordInput = document.getElementById("register-password")
    const registerPhoneInput = document.getElementById("register-phone")
    const registerTokenInput = document.getElementById("register-token")
    const registerButton = registerForm.querySelector("button")

    const deleteForm = document.getElementById("delete-form")
    const deleteMatriculaInput = document.getElementById("delete-matricula")
    const deletePasswordInput = document.getElementById("delete-password")
    const deleteTokenInput = document.getElementById("delete-token")
    const deleteButton = deleteForm.querySelector("button")

    const verificationModal = document.getElementById("verification-modal")
    const closeModalBtn = document.getElementById("close-modal-btn")
    const verificationForm = document.getElementById("verification-form")
    const verificationCodeInput = document.getElementById("verification-code")
    const verifyButton = document.getElementById("verify-btn")
    const modalMessageArea = document.getElementById("modal-message-area")

    const messageArea = document.getElementById("message-area")

    let tempStudentData = {}

    function showMessage(message, type, targetArea = messageArea) {
        targetArea.textContent = message
        targetArea.className = `message-area ${type}`
        if (type === "none") {
            targetArea.style.display = "none"
        } else {
            targetArea.style.display = "block"
        }
    }

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault()
        showMessage("", "none", messageArea)

        const matricula = registerMatriculaInput.value.trim()
        const senha = registerPasswordInput.value.trim()
        const numero_telefone = registerPhoneInput.value.trim()
        const token = registerTokenInput.value.trim()

        if (!matricula || !senha || !numero_telefone || !token) {
            showMessage("Por favor, preencha todos os campos de cadastro.", "error", messageArea)
            return
        }

        const originalButtonHtml = registerButton.innerHTML
        registerButton.disabled = true
        registerButton.innerHTML = '<div class="loader"></div>'

        try {
            const response = await fetch(`${API_BASE_URL}/verification-code`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    faculty_registration: matricula,
                    password: senha,
                    phone: numero_telefone,
                }),
            })

            const result = await response.json()

            if (response.ok) {
                tempStudentData = { matricula, senha, numero_telefone, token }

                showMessage("", "none", modalMessageArea)
                verificationCodeInput.value = ""
                verificationModal.style.display = "flex"
            } else {
                showMessage(
                    `Erro: ${result.detail || "Não foi possível gerar o código de verificação."}`,
                    "error",
                    messageArea
                )
            }
        } catch (error) {
            showMessage(
                "Erro de conexão. Verifique o console para mais detalhes.",
                "error",
                messageArea
            )
            console.error("Verification Code Generation Error:", error)
        } finally {
            registerButton.disabled = false
            registerButton.innerHTML = originalButtonHtml
        }
    })

    verificationForm.addEventListener("submit", async (event) => {
        event.preventDefault()
        showMessage("", "none", modalMessageArea)

        const verificationCode = verificationCodeInput.value.trim()

        if (!verificationCode) {
            showMessage("Por favor, insira o código de verificação.", "error", modalMessageArea)
            return
        }

        const originalVerifyButtonHtml = verifyButton.innerHTML
        verifyButton.disabled = true
        verifyButton.innerHTML = '<div class="loader"></div>'

        try {
            const response = await fetch(`${API_BASE_URL}/students`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${tempStudentData.token}`,
                },
                body: JSON.stringify({
                    faculty_registration: tempStudentData.matricula,
                    password: tempStudentData.senha,
                    phone: tempStudentData.numero_telefone,
                    code: verificationCode,
                }),
            })

            const result = await response.json()

            if (response.ok) {
                showMessage("Aluno cadastrado com sucesso!", "success", messageArea)
                registerForm.reset()
                verificationModal.style.display = "none"
                tempStudentData = {}
            } else {
                showMessage(
                    `Erro: ${result.detail || "Código de verificação inválido ou expirado."}`,
                    "error",
                    modalMessageArea
                )
            }
        } catch (error) {
            showMessage(
                "Erro de conexão. Verifique o console para mais detalhes.",
                "error",
                modalMessageArea
            )
            console.error("Student Registration Error:", error)
        } finally {
            verifyButton.disabled = false
            verifyButton.innerHTML = originalVerifyButtonHtml
        }
    })

    closeModalBtn.addEventListener("click", () => {
        verificationModal.style.display = "none"
        showMessage("", "none", modalMessageArea)
        verificationCodeInput.value = ""
    })

    deleteForm.addEventListener("submit", async (event) => {
        event.preventDefault()
        showMessage("", "none", messageArea)

        const matricula = deleteMatriculaInput.value.trim()
        const senha = deletePasswordInput.value.trim()
        const token = deleteTokenInput.value.trim()

        if (!matricula || !senha || !token) {
            showMessage("Por favor, preencha todos os campos de exclusão.", "error", messageArea)
            return
        }

        const originalButtonHtml = deleteButton.innerHTML
        deleteButton.disabled = true
        deleteButton.innerHTML = '<div class="loader"></div>'

        try {
            const response = await fetch(`${API_BASE_URL}/students/${matricula}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ password: senha }),
            })

            if (response.ok) {
                showMessage("Aluno excluído com sucesso!", "success", messageArea)
                deleteForm.reset()
            } else {
                const result = await response.json()
                showMessage(
                    `Erro: ${result.detail || "Não foi possível excluir."}`,
                    "error",
                    messageArea
                )
            }
        } catch (error) {
            showMessage(
                "Erro de conexão. Verifique o console para mais detalhes.",
                "error",
                messageArea
            )
            console.error("Deletion Error:", error)
        } finally {
            deleteButton.disabled = false
            deleteButton.innerHTML = originalButtonHtml
        }
    })
})