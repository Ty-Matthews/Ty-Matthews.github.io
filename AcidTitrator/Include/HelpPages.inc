<DIV ID="HelpPopupDIV" STYLE="display:none; overflow-y: clip">
	<div style="position:relative; top:0; left:0; width:100%; height:100%; background:#CCAC8A; border:1px solid black; padding:10px;  font:normal 10pt arial; padding-left:18px">
	<b>Help</b>
	<hr size="1" align="left" style="border:1px solid black; width: 420px;">
		<div style="width:340px; font-family:arial; font-size:80%; line-height:1.5em">
			<div id="ContainerDiv" style="overflow-y: scroll; width:420; height:320; border:1px solid black; border-top:1px solid black; border-left:1px solid black; background:#ffffff; padding:10px">
			</div>

			<img src="Images/GUI/CheckMarkUp.png" style="display: inline;" alt="Click to close" width="31" height="25"
				onclick="javascript:parent.oHelpPopup.hide();return(false);" 
				onmouseover="javascript:this.style.cursor='hand';"
				onmousedown="javascript:this.src='Images/GUI/CheckMarkDown.png';" 
				onmouseout="javascript:this.src='Images/GUI/CheckMarkUp.png';"
				onmouseup="javascript:this.src='Images/GUI/CheckMarkUp.png';">
 
		</div>
	</DIV>
	<div style="position: absolute; top:15; left:465px; width:20px; height:370px; border:1px solid black; border-bottom:1px solid white; border-right:1px solid white; filter:progid:DXImageTransform.Microsoft.Gradient(GradientType=0, StartColorStr=#FFFCB7, EndColorStr=#FFFFFF); padding:10px" >
	</div>
</div>

<div id="HelpContentsDIV" style="display: none;">
<b>Table of Contents</b>
<ul>
<li><a href="" onclick="javascript:parent.ChangeHelpPage('HelpOverviewDIV');">Overview</a>
<li><a href="" onclick="javascript:parent.ChangeHelpPage('HelpInterfaceDIV');">The Interface</a>
<li><a href="" onclick="javascript:parent.ChangeHelpPage('HelpAcidsBasesDIV');">Adding Acids and Bases</a>
<li><a href="" onclick="javascript:parent.ChangeHelpPage('HelpLibraryDIV');">Using the Library</a>
<li><a href="" onclick="javascript:parent.ChangeHelpPage('HelpLinksDIV');">Links</a>
<li><a href="" onclick="javascript:parent.ChangeHelpPage('HelpCitationsDIV');">Citations</a>
</ul>
</div>

<div id="HelpOverviewDIV" style="display:none;">
<table cellpadding="0" border="0" cellspacing="0" width="380">
<tr width="100%" style="font-family:arial; font-size:70%;"><td>
<b>Overview</b>
</td>
<td align="right">
<a href="" onclick="javascript:parent.ChangeHelpPage('HelpContentsDIV');">Table of Contents</a>
</td>
</tr>
</table>
<br>
Titration curves are an important part of analytical chemistry.  They provide chemists with a graphical
representation of how an acid-base titration reaction will proceed and where its equivalence points can
be found.  The Acid-Base Titrator is an application designed to calculate pH Titration curves for aqueous
solutions and serve as both a learning and quantitative tool.  You, the user, define the analyte and titrant 
solutions and the server will send back an image of the titration curve based on those parameters.  You may 
specify any arbitrary mix of acids, bases, and ampholytes for both solutions.  The equations used to generate
the curves were developed by Robert de Levie at Georgetown University and can be found in the <a href="" onclick="javascript:parent.ChangeHelpPage('HelpCitationsDIV');">citation
section</a>.<br>

<center>
<img src="./Images/GUI/OverviewImage1.png">&nbsp;&nbsp;&nbsp;<img src="./Images/GUI/OverviewImage2.png">
<img src="./Images/GUI/Burette.png">
</div>

<div id="HelpInterfaceDIV" style="display:none;">
<table cellpadding="0" border="0" cellspacing="0" width="380">
<tr width="100%" style="font-family:arial; font-size:70%;"><td>
<b>The Interface</b>
</td>
<td align="right">
<a href="" onclick="javascript:parent.ChangeHelpPage('HelpContentsDIV');">Table of Contents</a>
</td>
</tr>
</table>
<br>
</div>

<div id="HelpAcidsBasesDIV" style="display:none;">
<table cellpadding="0" border="0" cellspacing="0" width="380">
<tr width="100%" style="font-family:arial; font-size:70%;"><td>
<b>Adding Acids and Bases</b>
</td>
<td align="right">
<a href="" onclick="javascript:parent.ChangeHelpPage('HelpContentsDIV');">Table of Contents</a>
</td>
</tr>
</table>
<br>
</div>

<div id="HelpLibraryDIV" style="display:none;">
<table cellpadding="0" border="0" cellspacing="0" width="380">
<tr width="100%" style="font-family:arial; font-size:70%;"><td>
<b>Using the Library</b>
</td>
<td align="right">
<a href="" onclick="javascript:parent.ChangeHelpPage('HelpContentsDIV');">Table of Contents</a>
</td>
</tr>
</table>
<br>
</div>


<div id="HelpLinksDIV" style="display:none;">
<table cellpadding="0" border="0" cellspacing="0" width="380">
<tr width="100%" style="font-family:arial; font-size:70%;"><td>
<b>Links</b>
</td>
<td align="right">
<a href="" onclick="javascript:parent.ChangeHelpPage('HelpContentsDIV');">Table of Contents</a>
</td>
</tr>
</table>
<br>
</div>

<div id="HelpCitationsDIV" style="display:none;">
<table cellpadding="0" border="0" cellspacing="0" width="380">
<tr width="100%" style="font-family:arial; font-size:70%;"><td>
<b>Citations</b>
</td>
<td align="right">
<a href="" onclick="javascript:parent.ChangeHelpPage('HelpContentsDIV');">Table of Contents</a>
</td>
</tr>
</table>
<br>
de Levie, R.  "Explicit Expressions of the General Form of the Titration Curve in Terms of Concentration"
<i>J. Chem. Educ.</i>  <b>1993</b>, 70, 209.<br><br>
de Levie, R.  "General Expressions for Acid-Base Titrations of Arbitrary Mixtures"
<i>Anal. Chem.</i>  <b>1996</b>, 68, 585.
</div>
