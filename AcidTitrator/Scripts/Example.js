var LibraryExampleList = new Array();
var iLibraryExampleIndex = 0;

function AddLibraryExample( sName, sDescription, fMinpH, fMaxpH, fMinRatio, fMaxRatio )
{
	var iReturn = iLibraryExampleIndex;
	LibraryExampleList[iLibraryExampleIndex] = new LibraryExample( sName, sDescription, fMinpH, fMaxpH, fMinRatio, fMaxRatio );
	iLibraryExampleIndex++;
	return iReturn;
}

function LibraryExampleHasSpecies( sExample, sSpecies )
{
	for( var i = 0; i < iLibraryExampleIndex; i++ )
	{
		if( LibraryExampleList[i].GetName() == sExample )
		{
			return LibraryExampleList[i].HasSpecies( sSpecies );
		}
	}
	return false;
}

// Custom object for storing Library Examples
function LibraryExample( sName, sDescription, fMinpH, fMaxpH, fMinRatio, fMaxRatio )
{
	this.m_sName = sName;
	this.m_sDescription = sDescription;
	this.m_iSpeciesIndex = 0;
	// These are parallel arrays; they will always have the same number of entries
	this.m_SpeciesArray = new Array();
	this.m_SolutionArray = new Array();
	this.m_ConcentrationArray = new Array();
	
	this.m_fMinpH = fMinpH;
	this.m_fMaxpH = fMaxpH;
	this.m_fMinRatio = fMinRatio;
	this.m_fMaxRatio = fMaxRatio;
}
	
// Functions that are part of the LibraryExample object
LibraryExample.prototype.GetName = function()
{
	return this.m_sName;
}
		
LibraryExample.prototype.SetName = function(sName)
{
	this.m_sName = sName;
}
		
LibraryExample.prototype.GetDescription = function()
{
	return this.m_sDescription;
}
		
LibraryExample.prototype.SetDescription = function(sDescription)
{
	this.m_sDescription = sDescription;
}

LibraryExample.prototype.SetMinpH = function(fMinpH)
{
	this.m_fMinpH = fMinpH;
}

LibraryExample.prototype.GetMinpH = function()
{
	return this.m_fMinpH;
}

LibraryExample.prototype.SetMaxpH = function(fMaxpH)
{
	this.m_fMaxpH = fMaxpH;
}

LibraryExample.prototype.GetMaxpH = function()
{
	return this.m_fMaxpH;
}

LibraryExample.prototype.SetMinRatio = function(fMinRatio)
{
	this.m_fMinRatio = fMinRatio;
}

LibraryExample.prototype.GetMinRatio = function()
{
	return this.m_fMinRatio;
}

LibraryExample.prototype.SetMaxRatio = function(fMaxRatio)
{
	this.m_fMaxRatio = fMaxRatio;
}

LibraryExample.prototype.GetMaxRatio = function()
{
	return this.m_fMaxRatio;
}

LibraryExample.prototype.AddSpecies = function( sSpecies, sSolution, fConcentration )
{
	this.m_SpeciesArray[this.m_iSpeciesIndex] = sSpecies;
	this.m_SolutionArray[this.m_iSpeciesIndex] = sSolution;
	this.m_ConcentrationArray[this.m_iSpeciesIndex] = fConcentration;
	this.m_iSpeciesIndex++;	
}

LibraryExample.prototype.GetNumSpecies = function()
{
	return this.m_iSpeciesIndex;
}

LibraryExample.prototype.GetSpecies = function( iIndex )
{
	if( iIndex < this.m_iSpeciesIndex )
	{
		return this.m_SpeciesArray[iIndex];
	}
	return null;
}

LibraryExample.prototype.HasSpecies = function( sSpecies )
{
	for( var iIndex = 0; iIndex < this.m_iSpeciesIndex; iIndex++ )
	{
		if( this.m_SpeciesArray[iIndex] == sSpecies )
		{
			return true;
		}		
	}
	return false;
}

LibraryExample.prototype.GetSolution = function( iIndex )
{
	if( iIndex < this.m_iSpeciesIndex )
	{
		return this.m_SolutionArray[iIndex];
	}
	return null;
}

LibraryExample.prototype.GetConcentration = function( iIndex )
{
	if( iIndex < this.m_iSpeciesIndex )
	{
		return this.m_ConcentrationArray[iIndex];
	}
	return 0.0;
}

