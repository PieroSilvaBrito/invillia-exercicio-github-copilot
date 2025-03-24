document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  let activities = {}; // Variável para armazenar as atividades carregadas

  // Função para buscar atividades da API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      activities = await response.json(); // Armazenar as atividades carregadas

      // Limpar mensagem de carregamento
      activitiesList.innerHTML = "";

      // Limpar opções do combo de atividades
      activitySelect.innerHTML = '<option value="">-- Selecione uma atividade --</option>';

      // Popular lista de atividades
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;

        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Horário:</strong> ${details.schedule}</p>
          <p><strong>Vagas Disponíveis:</strong> ${spotsLeft} vagas restantes</p>
        `;

        activitiesList.appendChild(activityCard);

        // Adicionar opção ao dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Falha ao carregar atividades. Por favor, tente novamente mais tarde.</p>";
      console.error("Erro ao buscar atividades:", error);
    }
  }

  // Lidar com envio do formulário
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    // Validar se o e-mail já está cadastrado na atividade
    if (activities[activity]?.participants.includes(email)) {
      messageDiv.textContent = "Este e-mail já está inscrito nesta atividade.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");

      // Ocultar mensagem após 5 segundos
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
      return;
    }

    try {
      // Enviar o e-mail como parâmetro de query string
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();

        // Atualizar a lista de atividades após a inscrição
        await fetchActivities();
      } else {
        messageDiv.textContent = typeof result.detail === "string" 
          ? result.detail 
          : "Ocorreu um erro. Detalhes: " + JSON.stringify(result);
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Ocultar mensagem após 5 segundos
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Falha ao se inscrever. Por favor, tente novamente.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Erro ao se inscrever:", error);
    }
  });

  // Inicializar app
  fetchActivities();
});