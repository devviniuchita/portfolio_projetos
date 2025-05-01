// footer.js
export function setupFooter() {
  const shareButton = document.getElementById("share-button");

  // Define os dados a serem compartilhados
  const shareData = {
    title: "Escola de Japonês Online",
    text: "Aprenda japonês de onde estiver com Kengi Idiomas!",
    url: "https://www.kengi.com", // Substitua pela URL real do site
  };

  // Função para lidar com o compartilhamento
  shareButton.addEventListener("click", async () => {
    try {
      // Verifica se a Web Share API é suportada
      if (navigator.share) {
        await navigator.share(shareData);
        console.log("Conteúdo compartilhado com sucesso!");
      } else {
        // Fallback: Copia o link para a área de transferência
        await navigator.clipboard.writeText(shareData.url);
        alert("Link copiado para a área de transferência: " + shareData.url);
      }
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
      alert("Houve um erro ao tentar compartilhar.");
    }
  });
}
