var LibrarySpeciesList = new Array();
var iLibrarySpeciesIndex = 0;

function AddLibrarySpecies( sName, sType, sDescription, sImage, fStartPK )
{
	var iReturn = iLibrarySpeciesIndex;
	LibrarySpeciesList[iLibrarySpeciesIndex] = new LibrarySpecies( sName, sType, sDescription, sImage, fStartPK );
	iLibrarySpeciesIndex++;
	return iReturn;
}

// Custom object for storing Library Species
function LibrarySpecies( sName, sType, sDescription, sImage, fStartPK )
{
	this.m_sName = sName;
	this.m_sType = sType;
	this.m_sDescription = sDescription;
	this.m_sImage = sImage;	
	this.m_fStartPK = fStartPK;
	this.m_CategoryArray = new Array();	
	this.m_iCategoryIndex = 0;	
	this.m_iPKIndex = 0;
	this.m_PKArray = new Array();
	this.m_sPKs = "";
}
	
// Functions that are part of the Species object
LibrarySpecies.prototype.GetName = function()
{
	return this.m_sName;
}
		
LibrarySpecies.prototype.SetName = function(sName)
{
	this.m_sName = sName;
}
		
LibrarySpecies.prototype.GetType = function()
{
	return this.m_sType;
}		
		
LibrarySpecies.prototype.SetType = function(sType)
{
	this.m_sType = sType;
}

LibrarySpecies.prototype.GetStartPK = function()
{
	return this.m_fStartPK;
}
		
LibrarySpecies.prototype.SetStartPK = function(fStartPK)
{
	this.m_fStartPK = fStartPK;
}

LibrarySpecies.prototype.GetDescription = function()
{
	return this.m_sDescription;
}
		
LibrarySpecies.prototype.SetDescription = function(sDescription)
{
	this.m_sDescription = sDescription;
}

LibrarySpecies.prototype.GetImage = function()
{
	return this.m_sImage;
}		
		
LibrarySpecies.prototype.SetImage = function(sImage)
{
	this.m_sImage = sImage;
}

LibrarySpecies.prototype.AddCategory = function( sCategory )
{
	this.m_CategoryArray[this.m_iCategoryIndex] = sCategory;
	this.m_iCategoryIndex++;	
}

LibrarySpecies.prototype.HasCategory = function( sCategory )
{
	for( var i = 0; i < this.m_iCategoryIndex; i++ )
	{
		if( this.m_CategoryArray[i] == sCategory )
		{
			return true;
		}
	}
	return false;
}

LibrarySpecies.prototype.AddPK = function( fPK )
{
	this.m_PKArray[this.m_iPKIndex] = fPK;
	this.m_iPKIndex++;
	if( this.m_sPKs.length > 0 )
	{
		this.m_sPKs += ", ";
	}
	this.m_sPKs += fPK;
}

LibrarySpecies.prototype.GetPKList = function()
{
	return this.m_sPKs;
}

LibrarySpecies.prototype.GetPK = function( iIndex )
{	
	return this.m_PKArray[iIndex];
}

LibrarySpecies.prototype.GetNumPKs = function()
{
	return this.m_iPKIndex;
}

function GetLibrarySpeciesIndex( strName )
{
	for( var j = 0; j < iLibrarySpeciesIndex; j++ )
	{
		if( LibrarySpeciesList[j].GetName() == strName )
		{
			return j;
		}
	}
	return -1;
}