"use strict"

// A variável API_BASE_URL é injetada durante o build pelo GitHub Actions.

document.addEventListener("DOMContentLoaded", () => {
    // Elementos do formulário de registro
    const registerForm = document.getElementById("register-form")
    const registerMatriculaInput = document.getElementById("register-matricula")
    const registerPasswordInput = document.getElementById("register-password")
    const registerPhoneInput = document.getElementById("register-phone")
    const registerTokenInput = document.getElementById("register-token")

    // Elementos do formulário de exclusão
    const deleteForm = document.getElementById("delete-form")
    const deleteMatriculaInput = document.getElementById("delete-matricula")
    const deletePasswordInput = document.getElementById("delete-password")
    const deleteTokenInput = document.getElementById("delete-token")

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

        if (API_BASE_URL === "URL_DA_API_AQUI") {
            showMessage("A URL da API ainda não foi configurada no script.", "error")
            return
        }

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

        if (API_BASE_URL === "URL_DA_API_AQUI") {
            showMessage("A URL da API ainda não foi configurada no script.", "error")
            return
        }

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
        }
    })

    function showMessage(message, type) {
        messageArea.textContent = message
        messageArea.className = `message-area ${type}`
    }
})
