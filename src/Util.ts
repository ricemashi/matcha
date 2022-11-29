export function getNonce(): string {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export function extractKey(html: string) {
  const skss = html.indexOf("eval(function(p,a,c,k,e,d)");
  const skse = html.indexOf("</script>", skss);
  const sks = html.substring(skss, skse).replace("eval", "");

  const skds = eval(sks);

  const sksl = skds.indexOf("'");
  const skel = skds.indexOf(";");

  const skrs = skds.substring(sksl, skel);

  return eval(skrs) as string;
}
