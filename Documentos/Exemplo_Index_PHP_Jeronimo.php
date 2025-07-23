<?php require_once('../Connections/daibert.php'); ?>
<?php
// *** Restrict Access To Page: Grant or deny access to this page
$FF_authorizedUsers=" ";
$FF_authFailedURL="login.php";
$FF_grantAccess=0;
session_start();
if (isset($_SESSION["EDA_Username"])) {
  if (true || !(isset($_SESSION["EDA_UserAuthorization"])) || $_SESSION["EDA_UserAuthorization"]=="" || strpos($FF_authorizedUsers, $_SESSION["EDA_UserAuthorization"])) {
    $FF_grantAccess = 1;
  }
}
if (!$FF_grantAccess) {
  $FF_qsChar = "?";
  if (strpos($FF_authFailedURL, "?")) $FF_qsChar = "&";
    $FF_referrer = $_SESSION['PHP_SELF'];
  if (isset($_SERVER['QUERY_STRING']) && strlen($_SERVER['QUERY_STRING']) >
0) $FF_referrer .= "?" . $_SERVER['QUERY_STRING']; $FF_authFailedURL = $FF_authFailedURL . $FF_qsChar . "accessdenied=" . urlencode($FF_referrer); header("Location: $FF_authFailedURL"); exit; } ?> 
<?php

function formatSuit($number) {
//	$number = eregi_replace("[\.|-]", "", $number);
	$number = eregi_replace("([0-9][0-9][0-9][0-9])\.([0-9][0-9][0-9])\.([0-9][0-9][0-9])\.([0-9][0-9][0-9])\-([0-9])", "\\1.\\2.\\3\\4-\\5", $number);
	return $number;
}

function InvertDate($thadate)
{

if ($thadate!="") $newdate=substr($thadate,8,2)."/".substr($thadate,5,2)."/".substr($thadate,0,4);

else $newdate="";

return $newdate;

}

function GetClient($database_daibert, $daibert, $clicod)
{
mysql_select_db($database_daibert, $daibert);
$query_cli = "SELECT nome FROM clientes WHERE codigo = '$clicod'";
$cli = mysql_query($query_cli, $daibert) or die(mysql_error());
$row_cli = mysql_fetch_assoc($cli);
mysql_free_result($cli);
return $row_cli["nome"];

}

$SSAdv_colors1 = array("#FFFFFF","#EEEEEE");
$SSAdv_k1 = 0;
$SSAdv_m1 = 0;
$SSAdv_change_every1 = 1;


?>
<?php
mysql_select_db($database_daibert, $daibert);
$query_processos = "SELECT processos.*, TO_DAYS(processos.prazo)-TO_DAYS(NOW()) as difp, TO_DAYS(processos.audiencia)-TO_DAYS(NOW()) as difa, clientes.nome FROM processos, clientes WHERE processos.encarregado = ".$_SESSION['EDA_Codigo']." AND processos.fechado = 0 and clientes.codigo=processos.cliente_cod ORDER BY nome ASC";

//CRISTINA
if ($_SESSION['EDA_Codigo']==41) $query_processos = "SELECT processos.*, TO_DAYS(processos.prazo)-TO_DAYS(NOW()) as difp, TO_DAYS(processos.audiencia)-TO_DAYS(NOW()) as difa, clientes.nome FROM processos, clientes WHERE processos.encarregado = 35 AND processos.fechado = 0 and clientes.codigo=processos.cliente_cod ORDER BY nome ASC";
//CRISTINA

$processos = mysql_query($query_processos, $daibert) or die(mysql_error());
$row_processos = mysql_fetch_assoc($processos);
$totalRows_processos = mysql_num_rows($processos);
?>
<html><!-- InstanceBegin template="/Templates/painel.dwt.php" codeOutsideHTMLIsLocked="false" -->
<head>
<!-- InstanceBeginEditable name="doctitle" -->
		<title>
			EDA - Controle Processual: Principal
		</title>
<!-- InstanceEndEditable --> 
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<!-- InstanceBeginEditable name="head" -->
<!-- InstanceEndEditable -->
<link href="painel.css" rel="stylesheet" type="text/css">
<script language="javascript" src="daibert.js"></script>
</head>

<body>
<table width="100%" border="0" cellspacing="0" cellpadding="5">
  <tr valign="bottom"> 
    <td width="100" class="edahdr"><img src="logo-daibert.gif" alt="Escrit&oacute;rio Daibert de Advocacia" width="100" height="58"></td>
    <td colspan="2" align="center" valign="middle" class="edahdr"><!-- InstanceBeginEditable name="titulopagina" -->P&aacute;gina Principal: Seus Processos (<?php echo $totalRows_processos; ?>  processos encontrados)<!-- InstanceEndEditable --></td>
  </tr>
  <tr valign="top">
    <td class="edasubhdr" width="100" align="center">
	<?php require_once('atalhosh.inc.php'); ?>
	<!-- InstanceBeginEditable name="atalhos" --><!-- InstanceEndEditable -->
	<?php require_once('atalhosf.inc.php'); ?>
	<hr noshade="true" /><br />
	<?php require_once('busca.inc.php'); ?>
	</td>
  <!-- InstanceBeginEditable name="texto" --><td colspan="2">
<?php if ($totalRows_processos > 0) { // Show if recordset not empty ?> 
						<table border="0" cellpadding="5" width="100%" cellspacing="1">
							<tr bgcolor="#CCCCCC" class="textonormal">
								<td align="right">
									<b>N&uacute;mero</b>
								</td>
								<td>
									<b>Cliente</b>
								</td>
								<td>
									<b>Parte Contr&aacute;ria</b>
								</td>
								<td align="center">
									<b>Prazo</b>
								</td>
								<td align="center">
									<b>Audi&ecirc;ncia</b>
								</td>
								<td align="center" colspan="2">
									&nbsp;
								</td>
							</tr>
<?php do { 
  
  if ($row_processos['difp']<1&&$row_processos['prazo']) $bgp=" bgcolor=\"#FFCCCC\" ";
  else if ($row_processos['difp']<8&&$row_processos['prazo']) $bgp=" bgcolor=\"#FFFFCC\" ";
  else $bgp="";
 
  if ($row_processos['difa']<1&&$row_processos['audiencia']) $bga=" bgcolor=\"#FFCCCC\" ";
  else if ($row_processos['difa']<8&&$row_processos['audiencia']) $bga=" bgcolor=\"#FFFFCC\" ";
  else $bga="";

  ?>
<tr class="textonormal" bgcolor="<?php
	if($SSAdv_m1%$SSAdv_change_every1==0 && $SSAdv_m1>0){
	$SSAdv_k1++;
	}
	print $SSAdv_colors1[$SSAdv_k1%count($SSAdv_colors1)];
	$SSAdv_m1++;
	?>">
		<!-- Alterado dia 10/02/2013 - JLIRA
		<td align="right" nowrap><a href="http://srv85.tj.rj.gov.br/consultaProcessoWebV2/consultaProc.do?v=2&FLAGNOME=&back=1&tipoConsulta=publica&numProcesso=<?php echo formatSuit($row_processos['numero']); ?>" target="_blank"><?php echo $row_processos['numero']; ?></a></td>
		-->
		<!-- Alterado dia 16/06/2017 - JLIRA - Endereço do TJ alterou e link parou de funcionar
		<td align="right" nowrap><a href="http://srv85.tjrj.jus.br/numeracaoUnica/faces/index.jsp?numProcesso=<?php echo formatSuit($row_processos['numero']); ?>" target="_blank"><?php echo $row_processos['numero']; ?></a></td>
		--> 
		<td align="right" nowrap><a href="http://www4.tjrj.jus.br/consultaProcessoWebV2/consultaProc.do?FLAGNOME=&back=1&tipoConsulta=publica&numProcesso=<?php echo formatSuit($row_processos['numero']); ?>" target="_blank"><?php echo $row_processos['numero']; ?></a></td>
		<td >
			<?php echo $row_processos['nome']; echo $row_processos['unidades']?" (".$row_processos['unidades'].")":""; ?>
		</td>
		<td>
			<?php echo $row_processos['reu_nome']; ?>
		</td>
		<td align="center" <?php echo $bgp; ?>>
			<?php echo InvertDate($row_processos['prazo']); ?>
		</td>
		<td align="center" <?php echo $bga; ?>>
			<?php echo InvertDate($row_processos['audiencia']); ?>
		</td>
		<td align="center" nowrap>
			[<a href="det_processo.php?codigo=<?php echo $row_processos['codigo']; ?>">detalhes</a>] [<a href="lis_calculos.php?codigo=<?php echo $row_processos['codigo']; ?>">c&aacute;lculos</a>] 
			<?php 
				// CRISTINA
				if ($_SESSION['EDA_Codigo']!=41) { 
					?>					
					[<a href="alt_cliente.php?codigo=<?php echo $row_processos['cliente_cod']; ?>&ref=<?php echo urlencode($_SERVER['PHP_SELF'].'?'.$_SERVER['QUERY_STRING']); ?>">editar cliente</a>]
					<?php
				//CRISTINA
				} 
			?>
		</td>
</tr>
<?php } while ($row_processos = mysql_fetch_assoc($processos)); ?>
							<tr  bgcolor="#CCCCCC" class="textonormal">
								<td colspan="7">&nbsp;</td></tr>
								<?php } // Show if recordset not empty ?>

		</table>

		<?php if ($totalRows_processos == 0) { // Show if recordset empty ?>
			<tr>
				<td colspan="2"><span class="textonormal">Nenhum processo cadastado.
				</td>
			</tr>
		<?php } // Show if recordset empty ?>

</td>
<!-- InstanceEndEditable -->
  </tr>
  </table>
  
</body>
<!-- InstanceEnd --></html>