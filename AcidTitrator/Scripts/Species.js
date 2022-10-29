var SpeciesList = new Array();
var iSpeciesIndex = 0;	

// Custom object for storing Species
function Species( sName, fConcentration, sType, sSolution, fStartPK, iTypeIndex )
{
	this.m_sName = sName;
	this.m_fConcentration = fConcentration;
	this.m_sType = sType;
	this.m_iTypeIndex = iTypeIndex;
	this.m_bDeleted = false;
	this.m_sPKs = "";
	this.m_iPKIndex = 0;
	this.m_PKArray = new Array();
	this.m_sSolution = sSolution;
	this.m_fStartPK = fStartPK;		
}
	
// Functions that are part of the Species object
Species.prototype.GetName = function()
{
	return this.m_sName;
}
		
Species.prototype.SetName = function(sName)
{
	this.m_sName = sName;
}
		
Species.prototype.GetType = function()
{
	return this.m_sType;
}		
		
Species.prototype.SetType = function(sType)
{
	this.m_sType = sType;
}

Species.prototype.GetTypeIndex = function()
{
	return this.m_iTypeIndex;
}		
		
Species.prototype.SetTypeIndex = function(iTypeIndex)
{
	this.m_iTypeIndex = iTypeIndex;
}

Species.prototype.GetConcentration = function()
{
	return this.m_fConcentration;
}
		
Species.prototype.SetConcentration = function(fConcentration)
{
	this.m_fConcentration = fConcentration;
}

Species.prototype.SetSolution = function(sSolution)
{
	this.m_sSolution = sSolution;
}

Species.prototype.GetSolution = function()
{
	return this.m_sSolution;
}		

Species.prototype.GetPKs = function()
{
	return this.m_sPKs;
}

Species.prototype.GetStartPK = function()
{
	return this.m_fStartPK;
}
		
Species.prototype.SetStartPK = function(fStartPK)
{
	this.m_fStartPK = fStartPK;
}
		
Species.prototype.SetStartPKAsAverage = function()
{
	// This is really only valid for ampholytes with exactly 2 pKas.
	var fSum = 0.0;
	for( var j = 0; j < 2; j++ )
	{				
		fSum += this.m_PKArray[j];
	}
	this.m_fStartPK = fSum / 2.0;			
}

Species.prototype.Delete = function()
{
	this.m_bDeleted = true;
}
		
Species.prototype.IsDeleted = function()
{
	return this.m_bDeleted;
}

Species.prototype.AddPK = function(sPK)
{
	var fValue = parseFloat( sPK );
			
	// Check to see if it's already in our array
	var bExists = false;
	for( var i = 0; i < this.m_iPKIndex && !bExists; i++ )
	{
		if( fValue == this.m_PKArray[i] )
		{
			bExists = true;
		}
	}

	if( !bExists )
	{
		this.m_PKArray[this.m_iPKIndex] = fValue;
		this.m_iPKIndex++;
		if( this.m_sPKs.length > 0 )
		{
			this.m_sPKs += ", ";
		}
		this.m_sPKs += sPK;
	}			
}

Species.prototype.AddFloatPK = function(fPK)
{
	this.m_PKArray[this.m_iPKIndex] = fPK;
	this.m_iPKIndex++;
	if( this.m_sPKs.length > 0 )
	{
		this.m_sPKs += ", ";
	}
	this.m_sPKs += fPK;
}

Species.prototype.GetNumPKs = function()
{
	return this.m_iPKIndex;
}
		
Species.prototype.SortPKs = function()
{
	var fHold = 0.0;
	for( var j = 0; j < this.m_iPKIndex; j++ )
	{
		for( var i = j; i < this.m_iPKIndex; i++ )
		{
			if( this.m_PKArray[i] < this.m_PKArray[j] )
			{
				fHold = this.m_PKArray[i];
				this.m_PKArray[i] = this.m_PKArray[j];
				this.m_PKArray[j] = fHold;
			}
		}
	}	
}

Species.prototype.ParsePKs = function( sPKs )
{
	var i;
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
				this.AddPK( sValue );
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
		this.AddPK( sValue );
	}
	this.SortPKs();
	return this.GetNumPKs();
}

Species.prototype.Serialize = function( iIndex )
{
	var strSpecies = "";
	var strConvert = "";
			
	strConvert = iIndex + "_TYPE=" + this.GetType();
	strSpecies += hex_from_chars( strConvert ) + "00";

	strConvert = iIndex + "_CONC=" + this.GetConcentration();
	strSpecies += hex_from_chars( strConvert ) + "00";
			
	strConvert = iIndex + "_SOLN=" + this.GetSolution();
	strSpecies += hex_from_chars( strConvert ) + "00";

	strConvert = iIndex + "_NP=" + this.GetNumPKs();
	strSpecies += hex_from_chars( strConvert ) + "00";

	for( var j = 0; j < this.GetNumPKs(); j++ )
	{
		strConvert = iIndex + "_PK" + j + "=" + this.m_PKArray[j];			
		strSpecies += hex_from_chars( strConvert ) + "00";
	}
			
	if( this.GetType() == 'ampholyte' )
	{
		strConvert = iIndex + "_STPK=" + this.GetStartPK();
		strSpecies += hex_from_chars( strConvert ) + "00";
	}			
			
	return strSpecies;
}

// Function to create a new Species object and add it to the list	
function AddSpeciesObject( sName, fConcentration, sType, sSolution, fStartPK, iTypeIndex, sPKs )
{		
	var iReturn = iSpeciesIndex;
	var iCount = 0;		
	SpeciesList[iSpeciesIndex] = new Species( sName, fConcentration, sType, sSolution, fStartPK, iTypeIndex );		
	iCount = SpeciesList[iSpeciesIndex].ParsePKs( sPKs );
		
	// For ampholytes with only two pKa values, the start pKa must be the average of those
	// two; we didn't even ask the user to specify the starting species and just assumed
	// it's between the two.
	if( sType == 'ampholyte' && (iCount == 2) )
	{				
		SpeciesList[iSpeciesIndex].SetStartPKAsAverage();
	}
	iSpeciesIndex++;		
	return iReturn;
}

function SerializeSpecies()
{
	var strSpecies  = "";		
	var iCount = 0;
		
	for( var j = 0; j < iSpeciesIndex; j++ )
	{
		if( !SpeciesList[j].IsDeleted() )
		{				
			strSpecies += SpeciesList[j].Serialize( iCount );
			iCount++;
		}
	}
	return strSpecies;
}
	
function GetNumSpecies()
{
	var iCount = 0;
	for( var j = 0; j < iSpeciesIndex; j++ )
	{
		if( !SpeciesList[j].IsDeleted() )
		{
			iCount++;			
		}
	}
	return iCount;
}	

function GetNumSolutionSpecies( strSolution )
{
	var iCount = 0;
	for( var j = 0; j < iSpeciesIndex; j++ )
	{
		if( !SpeciesList[j].IsDeleted() && SpeciesList[j].GetSolution() == strSolution )
		{
			iCount++;			
		}
	}
	return iCount;
}
