	
	// Global variables	
	var iSpeciesMode = 0;
	var fStartPKa = 0.0;	
	
	if(!window.createPopup){
		alert("createPopup");
		window.createPopup = function (){
			var popup = document.createElement("iframe"), //must be iframe because existing functions are being called like parent.func()
				isShown = false, popupClicked = false;
			popup.src = "about:blank";
			popup.style.position = "absolute";
			popup.style.border = "0px";
			popup.style.display = "none";
			popup.addEventListener("load", function(e){
				popup.document = (popup.contentWindow || popup.contentDocument);//this will allow us to set innerHTML in the old fashion.
				if(popup.document.document) popup.document = popup.document.document;
			});
			document.body.appendChild (popup);
			var hidepopup = function (event){
				if(isShown)
					setTimeout(function (){
						if(!popupClicked){
							popup.hide();
						}
						popupClicked = false;
					}, 150);//timeout will allow the click event to trigger inside the frame before closing.
			}

			popup.show = function (x, y, w, h, pElement){
				if(typeof(x) !== 'undefined'){
					var elPos = [0, 0];
					if(pElement) elPos = findPos(pElement);//maybe validate that this is a DOM node instead of just falsy
					elPos[0] += y, elPos[1] += x;

					if(isNaN(w)) w = popup.document.scrollWidth;
					if(isNaN(h)) h = popup.document.scrollHeight;
					if(elPos[0] + w > document.body.clientWidth) elPos[0] = document.body.clientWidth - w - 5;
					if(elPos[1] + h > document.body.clientHeight) elPos[1] = document.body.clientHeight - h - 5;

					popup.style.left = elPos[0] + "px";
					popup.style.top = elPos[1] + "px";
					popup.style.width = w + "px";
					popup.style.height = h + "px";
				}
				popup.style.display = "block";
				isShown = true;
			}

			popup.hide = function (){
				isShown = false;
				popup.style.display = "none";
			}

			window.addEventListener('click', hidepopup, true);
			window.addEventListener('blur', hidepopup, true);
			return popup;
		}
	}
		
	// Popups
	var oAmpholytePopup = window.createPopup();
	var oHelpPopup = window.createPopup();
	var oLibraryPopup = window.createPopup();	
	var oExampleDescriptionPopup = window.createPopup();
	
	function CenterPopup( objPopup, iWidth, iHeight )
	{		
		objPopup.show( (document.body.clientWidth - iWidth) / 2, (document.body.clientHeight - iHeight) / 2, iWidth, iHeight, document.body );
	}
	
	function onDocLoad()
	{
		UpdateChart();
		DisplaySpeciesTable();
		
		// This one is within Default.asp since we need to read from the database
		LoadLibrary();
	}	
	
	function ChangeToTitrant()
	{
		EnableObject( "SampleDivID", false );
		EnableObject( "TitrantDivID", true );
		iSpeciesMode = 1;
		SetFocus();
	}

	function ChangeToSample()
	{
		EnableObject( "TitrantDivID", false );
		EnableObject( "SampleDivID", true );
		iSpeciesMode = 0;
		SetFocus();
	}
	
	function DisplayHelp()
	{
		oHelpPopup.document.body.innerHTML = HelpPopupDIV.innerHTML;
		ChangeHelpPage( "HelpContentsDIV" );
		CenterPopup( oHelpPopup, 500, 408 );
	}
	
	function ChangeHelpPage( sDIV )
	{
		var objContainer = oHelpPopup.document.getElementById("ContainerDiv");		
		var objHelp = document.getElementById(sDIV);
		if( objContainer && objHelp )
		{
			objContainer.innerHTML = objHelp.innerHTML;
		}
	}
	
	function DisplayLibrary()
	{
		oLibraryPopup.document.body.innerHTML = LibraryDIV.innerHTML;
		CenterPopup( oLibraryPopup, 400, 308 );
		LibraryChangeCategory();
	}

	function SetFocus()
	{
		if( iSpeciesMode == 0 )
		{
			document.SampleForm.SpeciesNameID.focus();
		}
		else
		{
			document.TitrantForm.SpeciesNameID.focus();
		}
	}
	
	function ChangeOptions()
	{
		// Don't fire twice, since the chart button was the object that received the focus
		if( GetNumSpecies() > 0 )
		{
			if( !event.toElement )
			{
				UpdateChart();
			}
			else
			{
				if( event.toElement.id != "ButtonsID" )
				{
					UpdateChart();
				}
			}
		}				
	}
	
	function UpdateChart()
	{
		var oChart = document.getElementById( "CHART" );
		var fMin;
		var fMax;
		if( oChart )
		{
			var strURL = "http://ty2k:8080/ATImageServer.dll?GeneratepHCurve&PARAMS=";
			strURL += hex_from_chars( "Width=570" ) + "00";
			strURL += hex_from_chars( "Height=470" ) + "00";
			strURL += hex_from_chars( "BGColor=#FFFFFF" ) + "00";
			strURL += hex_from_chars( "BorderColor=#D2D2CA" ) + "00";
			strURL += hex_from_chars( "PenColor=#000000" ) + "00";
			strURL += hex_from_chars( "GraphColor=#000080" ) + "00";			

			fMin = parseFloat( document.OptionsForm.MinRatioID.value );
			if( !isNaN( fMin ) )
			{
				if( fMin < 0.0 )
				{
					fMin = 0.0;					
				}
				document.OptionsForm.MinRatioID.value = fMin;
				strURL += hex_from_chars( "MinRatio=" + fMin ) + "00";
			}
			fMax = parseFloat( document.OptionsForm.MaxRatioID.value );
			if( !isNaN( fMax ) )
			{
				if( fMax < 0.0 )
				{
					fMax = 0.0;
				}
				if( fMax <= fMin )
				{
					if( fMin == 0.0 )
					{
						fMax = 2.0;
					}
					else
					{
						fMax = fMin * 2.0;
					}
				}
				document.OptionsForm.MaxRatioID.value = fMax;
				strURL += hex_from_chars( "MaxRatio=" + fMax ) + "00";
			}
			
			fMin = parseFloat( document.OptionsForm.MinpHID.value );
			if( fMin != 0 && !isNaN( fMin ) )
			{
				strURL += hex_from_chars( "MinpH=" + fMin ) + "00";
			}			
			fMax = parseFloat( document.OptionsForm.MaxpHID.value );
			if( fMax != 0 && !isNaN( fMax ) )
			{
				strURL += hex_from_chars( "MaxpH=" + fMax ) + "00";
			}
			strURL += hex_from_chars( "NumSpecies=" + GetNumSpecies() ) + "00";
			strURL += SerializeSpecies();			

			var Today = new Date();			
			strURL += "&REFRESH=";
			strURL += hex_from_chars( Today.toString() );
			oChart.src = strURL;
		}
		SetFocus();
	}

	function EnableObject( strObject, bEnable )
	{	
		var oStyle = document.getElementById( strObject ).style;
		if( oStyle )
		{
			if( bEnable )
			{
				oStyle.display = "inline";
			}
			else
			{
				oStyle.display = "none";
			}
		}
	}

	function ChangeSpeciesType()
	{
		if( iSpeciesMode == 0 )
		{
			iTypeIndex = document.SampleForm.SpeciesTypeID.selectedIndex;
			sType = document.SampleForm.SpeciesTypeID.options[iTypeIndex].name;
			if( (sType == 'strongacid') || (sType == 'strongbase') )
			{
				EnableObject( "SAMPLE_PK_TR", false );
				EnableObject( "SAMPLE_HOLDER_TR", true );
			}
			else
			{	
				EnableObject( "SAMPLE_HOLDER_TR", false );
				EnableObject( "SAMPLE_PK_TR", true );
			}
		}
		else
		{
			iTypeIndex = document.TitrantForm.SpeciesTypeID.selectedIndex;			
			sType = document.TitrantForm.SpeciesTypeID.options[iTypeIndex].name;			
			if( (sType == 'strongacid') || (sType == 'strongbase') )
			{
				EnableObject( "TITRANT_PK_TR", false );
				EnableObject( "TITRANT_HOLDER_TR", true );
			}
			else
			{	
				EnableObject( "TITRANT_HOLDER_TR", false );
				EnableObject( "TITRANT_PK_TR", true );
			}
		}		
	}	

			
	function CountPKs( sPKs )
	{
		// Just count how many unique pKa values are in the given string, but don't actually do anything
		// with them
		var i, k;
		var iCount = 0;
		var fValue = 0.0;
		var PKArray = new Array();
		var bExists = false;
		var sValue = "";
		var c = 'a';
		sPKs += "";
			
		for( var j = 0; j < sPKs.length; j++ )
		{	
			c = sPKs.charAt(j);
			i = parseInt( c );
				
			if( c != '.' && c != '-' && isNaN( i ) )
			{					
				if( sValue.length > 0 )
				{
					fValue = parseFloat( sValue );
					bExists = false;
					for( k = 0; k < iCount && !bExists; k++ )
					{
						if( PKArray[k] == fValue )
						{
							bExists = true;
						}
					}

					if( !bExists )
					{
						PKArray[iCount] = fValue;
						iCount++;
					}
					sValue = "";
				}
			}
			else
			{
				sValue += c;
			}
		}

		if( sValue.length > 0 )
		{
			fValue = parseFloat( sValue );
			bExists = false;
			for( k = 0; k < iCount && !bExists; k++ )
			{
				if( PKArray[k] == fValue )
				{
					bExists = true;
				}
			}

			if( !bExists )
			{
				// Don't need to add it to the array since we're not going to be looking for it again				
				iCount++;							
			}				
		}
		return iCount;
	}
	
	function CheckPKs( sPKs )
	{
		// Check to make sure the pKa values are within the acceptable range (-25 to +25)
		var i, k;
		var iCount = 0;
		var fValue = 0.0;
		var sValue = "";
		var c = 'a';
		sPKs += "";
			
		for( var j = 0; j < sPKs.length; j++ )
		{	
			c = sPKs.charAt(j);
			i = parseInt( c );
				
			if( c != '.' && c != '-' && isNaN( i ) )
			{					
				if( sValue.length > 0 )
				{
					fValue = parseFloat( sValue );
					if( fValue <= -25 || fValue >= 25 )
					{
						return false;
					}	
					sValue = "";
				}
			}
			else
			{
				sValue += c;
			}
		}

		if( sValue.length > 0 )
		{
			fValue = parseFloat( sValue );
			if( fValue <= -25 || fValue >= 25 )
			{
				return false;
			}

		}
		return true;
	}
		
	function FormatPKs( sPKs )
	{
		// Format the PK string in a standard way
		var i, k;
		var iCount = 0;
		var fValue = 0.0;
		var PKArray = new Array();
		var bExists = false;
		var sValue = "";
		var c = 'a';
		sPKs += "";
		var sReturn = "";
			
		for( var j = 0; j < sPKs.length; j++ )
		{	
			c = sPKs.charAt(j);
			i = parseInt( c );
				
			if( c != '.' && c != '-' && isNaN( i ) )
			{					
				if( sValue.length > 0 )
				{
					fValue = parseFloat( sValue );
					bExists = false;
					for( k = 0; k < iCount && !bExists; k++ )
					{
						if( PKArray[k] == fValue )
						{
							bExists = true;
						}
					}

					if( !bExists )
					{
						PKArray[iCount] = fValue;
						iCount++;
					}
					sValue = "";
				}
			}
			else
			{
				sValue += c;
			}
		}

		if( sValue.length > 0 )
		{
			fValue = parseFloat( sValue );
			bExists = false;
			for( k = 0; k < iCount && !bExists; k++ )
			{
				if( PKArray[k] == fValue )
				{
					bExists = true;
				}
			}

			if( !bExists )
			{
				PKArray[iCount] = fValue;
				iCount++;
			}
		}
			
		// Sort pKas in ascending order
		for( j = 0; j < iCount; j++ )
		{
			for( i = j; i < iCount; i++ )
			{
				if( PKArray[i] < PKArray[j] )
				{
					fValue = PKArray[i];
					PKArray[i] = PKArray[j];
					PKArray[j] = fValue;
				}
			}
		}	
			
		// Now build the return string
		for( k = 0; k < iCount; k++ )
		{
			if( k != 0 )
			{
				sReturn += ",";
			}
			sReturn += PKArray[k];
		}
			
		return sReturn;
	}
	
	function AddSpecies( bStartPKChosen )
	{	
		var fConc;
		var iTypeIndex;
		var iCount;
		var sType;
		var pK = "";
		var sValue = "";
		var NumProtons = "";
		var sSolution;
		var iAddedIndex = 0;
		var objForm;

		if( iSpeciesMode == 0 )
		{
			objForm = document.SampleForm;
			sSolution = "sample";
		}
		else
		{
			objForm = document.TitrantForm;
			sSolution = "titrant";
		}			
				
		if( objForm.SpeciesNameID.value == "" )
		{
			alert( "Please enter an identifying name." );
			objForm.SpeciesNameID.focus();
			return;
		}

		fConc = parseFloat( objForm.SpeciesConcentrationID.value );
				
		if( (fConc == 0) || isNaN( fConc ) )
		{
			alert( "Please specify a valid concentration." );
			objForm.SpeciesConcentrationID.focus();
			return;
		}

		iTypeIndex = objForm.SpeciesTypeID.selectedIndex;
		sType = objForm.SpeciesTypeID.options[iTypeIndex].value;
		if( (sType == 'acid') || (sType == 'base') || (sType == 'ampholyte') )
		{
			sValue = objForm.SpeciesPKsID.value;
			pK = parseFloat( sValue );			
			if( isNaN( pK ) )
			{
				alert( "Please specify at least one pKa value." );
				objForm.SpeciesPKsID.focus();
				return;
			}
			else
			{
				if( !CheckPKs( sValue ) )
				{
					alert( "pKa values must be greater than -25 and less than +25." );
					objForm.SpeciesPKsID.focus();
					return;
				}
			}
		
			if( sType == 'ampholyte' )
			{
				iCount = CountPKs( sValue );
				if( iCount < 2 )
				{
					alert( "Ampholytes must have a minimum of 2 pKa values." );
					objForm.SpeciesPKsID.focus();
					return;
				}
				else if( iCount > 2 )
				{	
					// See if the start pKa has already been chosen.  If not, bring up the pop-up
					// and ask the user to specify one.  Note that we can't just call into the popup
					// and wait for it to return; instead, the popup is displayed and the code returns
					// immediately, so we won't have a choice here yet.  So, we return instead and 
					// let the popup drive things.  The function for choosing the ampholyte pKa will call 
					// back with bStartPKChosen = true after the user chooses the appropriate start pKa.
					if( !bStartPKChosen )
					{
						ChooseAmpholytePK( sValue );						
						return;
					}				
				}
				else
				{
					// iCount == 2, but we don't need to ask for which is the starting pKa since
					// there's only one choice.  This case is handled in the AddSpeciesObject()
					// function, so we need not do anything here...
				}
			}
		}

				
		iAddedIndex = AddSpeciesObject( objForm.SpeciesNameID.value, fConc, sType, sSolution, fStartPKa, iTypeIndex, objForm.SpeciesPKsID.value );
		
		objForm.SpeciesNameID.value = "";
		objForm.SpeciesConcentrationID.value = "";				
		objForm.SpeciesPKsID.value = "";	
		
		DisplaySpeciesTable();
		SetFocus();		
	}
	
	function RemoveSpecies( strIndex, bUpdateForm )
	{		
		var iIndex = parseInt( strIndex );
		var objForm;

		if( bUpdateForm )
		{
			if( iSpeciesMode == 0 )
			{
				objForm = document.SampleForm;
			}
			else
			{
				objForm = document.TitrantForm;
			}
			objForm.SpeciesNameID.value = SpeciesList[iIndex].GetName();
			objForm.SpeciesConcentrationID.value = SpeciesList[iIndex].GetConcentration();
			objForm.SpeciesTypeID.selectedIndex = SpeciesList[iIndex].GetTypeIndex();				
			objForm.SpeciesPKsID.value = SpeciesList[iIndex].GetPKs();			
		}
		
		// If we're the last entry, move down a notch
		if( iIndex == (iSpeciesIndex - 1) )
		{
			iSpeciesIndex--;
			SpeciesList[iIndex] = null;
		}
		else
		{
			SpeciesList[iIndex].Delete();			
		}
		DisplaySpeciesTable();
		ChangeSpeciesType();
		SetFocus();	
	}

	function RemoveAllSolutionSpecies( strSolution, bPrompt )
	{		
		if( GetNumSolutionSpecies( strSolution ) > 1 && bPrompt )
		{
			if( !confirm( "Are you sure you want to remove all species from the " + strSolution + " list?" ) )
			{
				return;
			}
		}
		
		if( GetNumSolutionSpecies( strSolution ) == 0 )
		{
			if( iSpeciesMode == 0 )
			{
				objForm = document.SampleForm;
			}
			else
			{
				objForm = document.TitrantForm;
			}
			objForm.SpeciesNameID.value = "";
			objForm.SpeciesConcentrationID.value = "";			
			objForm.SpeciesPKsID.value = "";
		}
		else
		{		
			for( var j = 0; j < iSpeciesIndex; j++ )
			{
				if( SpeciesList[j].GetSolution() == strSolution )
				{
					if( j == (iSpeciesIndex -1 ) )
					{
						iSpeciesIndex--;
						SpeciesList[j] = null;
					}
					else
					{
						SpeciesList[j].Delete();
					}
				}
			}
			DisplaySpeciesTable();
		}
		SetFocus();
	}	
	
	function ChooseAmpholytePK( sPKs )
	{	
		// Parse through the PKs and then sort them.
		var j = 0;
		var i = 0;
		var k = 0;
		var iCount = 0;
		var fHold = 0.0;
		var fValue = 0.0;
		var sValue = "";
		var c = 'a';
		sPKs += "";
		var PKArray = new Array();
		var PKAverages = new Array();
		var bExists = false;
			
		for( j = 0; j < sPKs.length; j++ )
		{	
			c = sPKs.charAt(j);
			i = parseInt( c );
				
			if( c != '.' && c != '-' && isNaN( i ) )
			{
				if( sValue.length > 0 )
				{
					fValue = parseFloat( sValue );
					// Check to see if it's already in our array
					bExists = false;
					for( k = 0; k < iCount && !bExists; k++ )
					{
						if( fValue == PKArray[k] )
						{
							bExists = true;
						}
					}

					if( !bExists )
					{
						PKArray[iCount] = fValue;
						iCount++;
					}
					
					sValue = "";
				}
			}
			else
			{
				sValue += c;
			}
		}
		
		// Take care of any remaining one
		if( sValue.length > 0 )
		{
			fValue = parseFloat( sValue );
			// Check to see if it's already in our array
			bExists = false;
			for( k = 0; k < iCount && !bExists; k++ )
			{
				if( fValue == PKArray[k] )
				{
					bExists = true;
				}
			}

			if( !bExists )
			{
				PKArray[iCount] = fValue;
				iCount++;
			}			
		}
		
		// Sort pKas in ascending order
		for( j = 0; j < iCount; j++ )
		{
			for( i = j; i < iCount; i++ )
			{
				if( PKArray[i] < PKArray[j] )
				{
					fHold = PKArray[i];
					PKArray[i] = PKArray[j];
					PKArray[j] = fHold;
				}
			}
		}	
		
		// Now build an array one item shorter that includes the averaged pKa values.  The first two
		// are averaged together, the second and third, etc.  This assures that when the user chooses
		// one of the options, the pKa we'll use is between two of the valid pKa values.
		for( j = 0; j < iCount - 1; j++ )
		{
			PKAverages[j] = (PKArray[j] + PKArray[j + 1]) / 2.0;			
		}
		
		oAmpholytePopup.document.body.innerHTML = AmpholyteDIV.innerHTML;
		var objContainer = oAmpholytePopup.document.getElementById("ContainerDiv");
		
		// Write out the frame we'll actually place the options into.  
		var iHTML = "<div id=\"FrameID\" style=\"overflow-y:scroll;position:relative; width:320; height:150; top:0; left:0;\"></div>";
		objContainer.innerHTML = iHTML;
				
		var objFrame = oAmpholytePopup.document.getElementById("FrameID");
		if( objFrame )
		{			
			for( j = 0; j < iCount - 1; j++ )
			{				
				objFrame.innerHTML += "<input onclick=\"javascript:parent.SetAmpholytePKChoice(" + PKAverages[iCount - 2 - j] + ");\" type=radio hidefocus=true name=pkachoice value=" + PKAverages[j] + ">";
				
				// output the association protons
				for( i = (iCount - 1 - j); i >= 1; i-- )
				{
					objFrame.innerHTML += "H";
					if( i > 1 )
					{
						objFrame.innerHTML += "<sub>" + i + "</sub>";
					}
					objFrame.innerHTML += "[X]<img src=\"Images/GUI/EquilibrationArrows.png\">";
				}
				objFrame.innerHTML += "<font color=blue><b>[X]</b></font><img src=\"Images/GUI/EquilibrationArrows.png\">";
				
				// output the dissociation protons
				for( i = 0; i < j + 1; i++ )
				{
					objFrame.innerHTML += "[X] + ";
					if( (i + 1) > 1 )
					{
						objFrame.innerHTML += (i + 1);
					}
					objFrame.innerHTML += "H<sup>+</sup>";
					if( i != j )
					{
						objFrame.innerHTML += "<img src=\"Images/GUI/EquilibrationArrows.png\">";
					}
				}
				objFrame.innerHTML += "<br>";
			}		
		}
		
		EnableObject( "PKCheckUpID", false );
		EnableObject( "PKCheckDisabledID", true );		
		CenterPopup( oAmpholytePopup, 400, 308 );
	}
	
	function SetAmpholytePKChoice( fPK )
	{		
		var obj = oAmpholytePopup.document.getElementById("PKCheckDisabledID");
		if( obj )
		{
			obj.style.display = "none";
		}
		obj = oAmpholytePopup.document.getElementById("PKCheckUpID");
		if( obj )
		{
			obj.style.display = "inline";
		}		
		fStartPKa = fPK;
	}
	
	function AcceptAmpholytePKChoice()
	{
		// We pass true here since the start PK has been chosen
		oAmpholytePopup.hide();		
		AddSpecies( true );
	}
	
	function DisplaySpeciesTable()
	{
		if( iSpeciesMode == 0 )
		{
			OutputSolutionTable( "sample" );
		}
		else
		{
			OutputSolutionTable( "titrant" );
		}
	}
	
	function OutputSolutionTable( strSolution )
	{
		var objFrame;
		var bOutput;
		var strMinusSign = "";
		var strName = "";
		var j, k;
		if( strSolution == "sample" )
		{
			objFrame = parent.IFrameSample;			
		}
		else
		{
			objFrame = parent.IFrameTitrant;			
		}
		
		if( objFrame )
		{
			objFrame.document.open();
			objFrame.document.write();
			objFrame.document.writeln ("<html>");
			objFrame.document.writeln ("<head>");
			objFrame.document.writeln ("<link rel=stylesheet href=\"Styles/Titrator.css\" type=\"text/css\">");
			objFrame.document.writeln ("</head>");
			objFrame.document.writeln ("<body bgcolor=\"#ffffff\">");
			
			objFrame.document.writeln ("<" + "script language=\"javascript\">");
			objFrame.document.writeln ("<!-- Hide from unsupported browsers");
			objFrame.document.writeln ("	function RemoveSpecies(objSpecies)");
			objFrame.document.writeln ("	{");
			objFrame.document.writeln ("		var strSpecies = objSpecies.id;");
			objFrame.document.writeln ("		parent.execScript(\"RemoveSpecies(\" + strSpecies + \", true )\");");
			objFrame.document.writeln ("	}");
			objFrame.document.writeln ("// End hiding -->");
			objFrame.document.writeln ("</" + "script>");			
			
			for( j = 0; j < iSpeciesIndex; j++ )
			{		
				bOutput = true;		
				if( SpeciesList[j].IsDeleted() )
				{
					bOutput	= false;
				}
				if( SpeciesList[j].GetSolution() != strSolution )
				{
					bOutput	= false;
				}
				if( bOutput )
				{
					objFrame.document.writeln ("<span class=\"" + SpeciesList[j].GetType() + "\">");
					objFrame.document.write ("<img alt=\"Click to remove this Species\" ");
					objFrame.document.writeln ("src=\"Images/GUI/XButton.png\" border=\"0\" style=\"cursor:hand\" onclick=\"javascript:RemoveSpecies(this)\" id=\"" + j + "\">");
					objFrame.document.write( SpeciesList[j].GetConcentration() + " M&nbsp;");

					objFrame.document.write( SpeciesList[j].GetName() + "&nbsp;" );
					
					if( SpeciesList[j].GetType() != 'strongacid' && SpeciesList[j].GetType() != 'strongbase' )
					{
						objFrame.document.write( "(" + SpeciesList[j].GetPKs() + ")" );
					}
					objFrame.document.writeln ("\n</span>\n<br>");					
				}
			}			
			
			objFrame.document.writeln ("</body>");
			objFrame.document.writeln ("</html>");
			objFrame.document.close();
		}		
	}
		
	function LibraryChangeCategory()
	{
		// Change what's displayed in the Library DIV based on the category choice
		var objSelect = oLibraryPopup.document.getElementById("LibraryCategoryID");
		var iIndex = objSelect.selectedIndex;
		var sCategory = objSelect.options[iIndex].value;
		var objContainer = oLibraryPopup.document.getElementById("ContainerDiv");
		objContainer.innerHTML = "";
		var i;
		
		for( i = 0; i < iLibrarySpeciesIndex; i++ )
		{
			if( (sCategory == "All") || (LibrarySpeciesList[i].HasCategory( sCategory )) )
			{
				objContainer.innerHTML += "<img src='Images/GUI/PlusButton.png' height=9 width=9 alt='Click to add this species' onmouseover=\"this.style.cursor='hand';\" onclick=\"javascript:parent.AddFromLibrary(" + i + ");\">";
				objContainer.innerHTML += "&nbsp;<b>" + LibrarySpeciesList[i].GetName() + "</b>";
				objContainer.innerHTML += "&nbsp;(" + LibrarySpeciesList[i].GetDescription() + ")<br>";				
			}		
		}
		
		if( sCategory == "Examples" )
		{
			for( i = 0; i < iLibraryExampleIndex; i++ )
			{
				objContainer.innerHTML += "<img src='Images/GUI/PlusButton.png' height=9 width=9 alt='Click to use this example' onmouseover=\"this.style.cursor='hand';\" onclick=\"javascript:parent.UseExample(" + i + ");\">";
				objContainer.innerHTML += "&nbsp;<b>" + LibraryExampleList[i].GetName() + "</b><br>";
				objContainer.innerHTML += "<div style=\"padding-Left:12px;\">" + LibraryExampleList[i].GetDescription() + "</div><br>";
			}
		}	
	}
	
	function AddFromLibrary( iIndex )
	{
		oLibraryPopup.hide();
		var sSolution;
		if( iSpeciesMode == 0 )
		{
			sSolution = 'sample';
		}
		else
		{
			sSolution = 'titrant';
		}
		
		var bDone = false;
		var fConc;
		var Response;
		while( !bDone )
		{
			Response = window.prompt( "Please enter the concentration of this species:", "0.1" );
			if( !Response )
			{
				return;
			}
			fConc = parseFloat( Response  );
			if( !isNaN( fConc ) )
			{
				bDone = true;
			}			
		}		
		
		SpeciesList[iSpeciesIndex] = new Species( LibrarySpeciesList[iIndex].GetName(), fConc, LibrarySpeciesList[iIndex].GetType(), sSolution, LibrarySpeciesList[iIndex].GetStartPK(), 0 );
		for( var i = 0; i < LibrarySpeciesList[iIndex].GetNumPKs(); i++ )
		{
			SpeciesList[iSpeciesIndex].AddFloatPK( LibrarySpeciesList[iIndex].GetPK(i) );
		}
		SpeciesList[iSpeciesIndex].SetStartPK( LibrarySpeciesList[iIndex].GetStartPK() );
		
		if( LibrarySpeciesList[iIndex].GetType() == 'ampholyte' && (LibrarySpeciesList[iIndex].GetNumPKs() == 2) )
		{				
			SpeciesList[iSpeciesIndex].SetStartPKAsAverage();
		}
	
		// Set the type index so if they remove it from the list the type option will fill properly	
		for( i = 0; i < document.SampleForm.SpeciesTypeID.options.length; i++ )
		{
			if( document.SampleForm.SpeciesTypeID.options.item(i).value == LibrarySpeciesList[iIndex].GetType() )
			{
				SpeciesList[iSpeciesIndex].SetTypeIndex( i );
			}
		}
		iSpeciesIndex++;
		DisplaySpeciesTable();
	}
	
	function UseExample( iExampleIndex )
	{
		var i,j;
		oLibraryPopup.hide();		
		
		// Wipe out the current lists
		RemoveAllSolutionSpecies( 'sample', false );
		RemoveAllSolutionSpecies( 'titrant', false );
		
		for( i = 0; i < LibraryExampleList[iExampleIndex].GetNumSpecies(); i++ )
		{
			iLibraryIndex = GetLibrarySpeciesIndex( LibraryExampleList[iExampleIndex].GetSpecies( i ) );
			if( iLibraryIndex != -1 )
			{				
				// Should not be possible to receive -1, but just to prevent errors...				
				SpeciesList[iSpeciesIndex] = new Species( LibrarySpeciesList[iLibraryIndex].GetName(), LibraryExampleList[iExampleIndex].GetConcentration( i ), LibrarySpeciesList[iLibraryIndex].GetType(), LibraryExampleList[iExampleIndex].GetSolution( i ), LibrarySpeciesList[iLibraryIndex].GetStartPK(), 0 );
				for( j = 0; j < LibrarySpeciesList[iLibraryIndex].GetNumPKs(); j++ )
				{
					SpeciesList[iSpeciesIndex].AddFloatPK( LibrarySpeciesList[iLibraryIndex].GetPK(j) );
				}
				SpeciesList[iSpeciesIndex].SetStartPK( LibrarySpeciesList[iLibraryIndex].GetStartPK() );
		
				if( LibrarySpeciesList[iLibraryIndex].GetType() == 'ampholyte' && (LibrarySpeciesList[iLibraryIndex].GetNumPKs() == 2) )
				{				
					SpeciesList[iSpeciesIndex].SetStartPKAsAverage();
				}
	
				// Set the type index so if they remove it from the list the type option will fill properly	
				for( j = 0; j < document.SampleForm.SpeciesTypeID.options.length; j++ )
				{
					if( document.SampleForm.SpeciesTypeID.options.item(j).value == LibrarySpeciesList[iLibraryIndex].GetType() )
					{
						SpeciesList[iSpeciesIndex].SetTypeIndex( j );
					}
				}
				iSpeciesIndex++;		
			}			
		}
		
		// Set the min/max options
		document.OptionsForm.MinpHID.value = LibraryExampleList[iExampleIndex].GetMinpH();
		document.OptionsForm.MaxpHID.value = LibraryExampleList[iExampleIndex].GetMaxpH();
		document.OptionsForm.MinRatioID.value = LibraryExampleList[iExampleIndex].GetMinRatio();
		document.OptionsForm.MaxRatioID.value = LibraryExampleList[iExampleIndex].GetMaxRatio();
		
		// We have to call these directly since we're automatically placing items into the lists,
		// not through the GUI
		OutputSolutionTable( "sample" );
		OutputSolutionTable( "titrant" );
		UpdateChart();
	}
	

function findPos(obj, foundScrollLeft, foundScrollTop) {
    var curleft = 0;
    var curtop = 0;
    if(obj.offsetLeft) curleft += parseInt(obj.offsetLeft);
    if(obj.offsetTop) curtop += parseInt(obj.offsetTop);
    if(obj.scrollTop && obj.scrollTop > 0) {
        curtop -= parseInt(obj.scrollTop);
        foundScrollTop = true;
    }
    if(obj.scrollLeft && obj.scrollLeft > 0) {
        curleft -= parseInt(obj.scrollLeft);
        foundScrollLeft = true;
    }
    if(obj.offsetParent) {
        var pos = findPos(obj.offsetParent, foundScrollLeft, foundScrollTop);
        curleft += pos[0];
        curtop += pos[1];
    } else if(obj.ownerDocument) {
        var thewindow = obj.ownerDocument.defaultView;
        if(!thewindow && obj.ownerDocument.parentWindow)
            thewindow = obj.ownerDocument.parentWindow;
        if(thewindow) {
            if (!foundScrollTop && thewindow.scrollY && thewindow.scrollY > 0) curtop -= parseInt(thewindow.scrollY);
            if (!foundScrollLeft && thewindow.scrollX && thewindow.scrollX > 0) curleft -= parseInt(thewindow.scrollX);
            if(thewindow.frameElement) {
                var pos = findPos(thewindow.frameElement);
                curleft += pos[0];
                curtop += pos[1];
            }
        }
    }
    return [curleft,curtop];
}