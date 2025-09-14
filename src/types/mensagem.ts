export default interface Mensagem {
  id: number;
  text: string;
  sender: "me" | "other";
}
