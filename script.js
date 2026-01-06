"use strict"

// A API_BASE_URL é injetada durante o build. O valor abaixo é um placeholder.
const API_BASE_URL = "https://placeholder-for-build.com";

document.addEventListener("DOMContentLoaded", () => {
    // Elementos do formulário de registro
    const registerForm = document.getElementById("register-form")
    const registerMatriculaInput = document.getElementById("register-matricula")
    const registerPasswordInput = document.getElementById("register-password")
    const registerPhoneInput = document.getElementById("register-phone")
    const registerTokenInput = document.getElementById("register-token")
    const registerButton = registerForm.querySelector("button")

    // Elementos do formulário de exclusão
    const deleteForm = document.getElementById("delete-form")
    const deleteMatriculaInput = document.getElementById("delete-matricula")
    const deletePasswordInput = document.getElementById("delete-password")
    const deleteTokenInput = document.getElementById("delete-token")
    const deleteButton = deleteForm.querySelector("button")

    // Área de mensagem
    const messageArea = document.getElementById("message-area")

    // Lidar com o envio do formulário de registro
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault()
        showMessage("", "none")

        const matricula = registerMatriculaInput.value.trim()
        const senha = registerPasswordInput.value.trim()
        const numero_telefone = registerPhoneInput.value.trim()
        const token = registerTokenInput.value.trim()

        if (!matricula || !senha || !numero_telefone || !token) {
            showMessage("Por favor, preencha todos os campos de cadastro.", "error")
            return
        }

        const originalButtonHtml = registerButton.innerHTML
        registerButton.disabled = true
        registerButton.innerHTML = '<div class="loader"></div>'

        try {
            const response = await fetch(`${API_BASE_URL}/students`, {
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
                showMessage("Aluno cadastrado com sucesso!", "success")
                registerForm.reset()
            } else {
                showMessage(`Erro: ${result.detail || "Não foi possível cadastrar."}`, "error")
            }
        } catch (error) {
            showMessage("Erro de conexão. Verifique o console para mais detalhes.", "error")
            console.error("Registration Error:", error)
        } finally {
            registerButton.disabled = false
            registerButton.innerHTML = originalButtonHtml
        }
    })

    // Lidar com o envio do formulário de exclusão
    deleteForm.addEventListener("submit", async (event) => {
        event.preventDefault()
        showMessage("", "none")

        const matricula = deleteMatriculaInput.value.trim()
        const senha = deletePasswordInput.value.trim()
        const token = deleteTokenInput.value.trim()

        if (!matricula || !senha || !token) {
            showMessage("Por favor, preencha todos os campos de exclusão.", "error")
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
                showMessage("Aluno excluído com sucesso!", "success")
                deleteForm.reset()
            } else {
                const result = await response.json()
                showMessage(`Erro: ${result.detail || "Não foi possível excluir."}`, "error")
            }
        } catch (error) {
            showMessage("Erro de conexão. Verifique o console para mais detalhes.", "error")
            console.error("Deletion Error:", error)
        } finally {
            deleteButton.disabled = false
            deleteButton.innerHTML = originalButtonHtml
        }
    })

    function showMessage(message, type) {
        messageArea.textContent = message
        messageArea.className = `message-area ${type}`
    }
})
