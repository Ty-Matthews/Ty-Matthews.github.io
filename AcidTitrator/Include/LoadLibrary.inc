<%
'******************************************************************************************
'***	LoadLibrary.inc
'***
'******************************************************************************************
%>

<script language="javascript">
	function LoadLibrary()
	{
		var iIndex;		
<%
	' The "LL" prefix is to avoid duplicate variables in the other pages that may include this file
	dim LLstrSQL
	dim LLdbConn
	dim LLdbCmd
	dim LLdbRS
	dim LLdbSpeciesRS
	dim LLdbCategoryRS
	dim LLfldName, LLfldType, LLfldDescription, LLfldImage, LLfldpKa, LLfldCategory, LLfldStartpKa
	dim LLfldMinPH, LLfldMaxPH, LLfldMinRatio, LLfldMaxRatio
	dim LLfldSpeciesName, LLfldSolution, LLfldConcentration
	
	
	set LLdbConn = Server.CreateObject("ADODB.Connection")
	set LLdbCmd = Server.CreateObject("ADODB.Command")
	LLdbConn.Open( DATABASE_DSN_STRING )
	
	LLdbCmd.ActiveConnection = LLdbConn	
	LLdbCmd.CommandText = "call titrator.sp_get_species();"	
	set LLdbRS = LLdbCmd.Execute()	
	if( not LLdbRS.EOF ) then
		set LLfldName = LLdbRS.Fields( "name" )
		set LLfldType = LLdbRS.Fields( "species_type" )
		set LLfldDescription = LLdbRS.Fields( "description" )
		set LLfldImage = LLdbRS.Fields( "image" )
		set LLfldStartpKa = LLdbRS.Fields( "start_pka" )
	end if
	
	while( not LLdbRS.EOF )
		if( LLfldStartpKa.Value <> "" ) then 
%>
		iIndex = AddLibrarySpecies( '<% = LLfldName.Value %>', '<% = LLfldType.Value %>', '<% = LLfldDescription.Value %>', '<% = LLfldImage.Value %>', <% = LLfldStartpKa.Value %> );
<%
		else
%>
		iIndex = AddLibrarySpecies( '<% = LLfldName.Value %>', '<% = LLfldType.Value %>', '<% = LLfldDescription.Value %>', '<% = LLfldImage.Value %>', 0 );
<%		
		end if
		LLdbCmd.CommandText = "call titrator.sp_get_pka_values('"	& LLfldName.Value & "');"
		set LLdbPKRS = LLdbCmd.Execute()
		if( not LLdbPKRS.EOF ) then
			set LLfldpKa = LLdbPKRS.Fields( "pka" )
		end if
		while( not LLdbPKRS.EOF )
%>
		LibrarySpeciesList[iIndex].AddPK( <% = LLfldpKa.Value %> );
<%
			LLdbPKRS.MoveNext
		wend
		LLdbPKRS.Close()
		set LLdbPKRS = nothing
		
		LLdbCmd.CommandText = "call titrator.sp_get_species_categories('"	& LLfldName.Value & "');"
		set LLdbCategoryRS = LLdbCmd.Execute()
		if( not LLdbCategoryRS.EOF ) then
			set LLfldCategory = LLdbCategoryRS.Fields( "category" )
		end if
		while( not LLdbCategoryRS.EOF )
%>
		LibrarySpeciesList[iIndex].AddCategory( '<% = LLfldCategory.Value %>' );
<%
			LLdbCategoryRS.MoveNext
		wend
		LLdbCategoryRS.Close()
		set LLdbCategoryRS = nothing
		LLdbRS.MoveNext
	wend
	LLdbRS.Close()		
	set LLdbRS = nothing
	
	' Now get all of the example solutions
	LLdbCmd.CommandText = "call titrator.sp_get_example_solutions();"	
	set LLdbRS = LLdbCmd.Execute()	
	if( not LLdbRS.EOF ) then
		set LLfldName = LLdbRS.Fields( "name" )
		set LLfldDescription = LLdbRS.Fields( "description" )
		set LLfldMinPH = LLdbRS.Fields( "min_ph" )
		set LLfldMaxPH = LLdbRS.Fields( "max_ph" )
		set LLfldMinRatio = LLdbRS.Fields( "min_ratio" )
		set LLfldMaxRatio = LLdbRS.Fields( "max_ratio" )
	end if
	
	while( not LLdbRS.EOF )
%>
		iIndex = AddLibraryExample( "<% = LLfldName.Value %>", "<% = LLfldDescription.Value %>", <% = LLfldMinPH.Value %>, <% = LLfldMaxPH.Value %>, <% = LLfldMinRatio.Value %>, <% = LLfldMaxRatio.Value %>);
<%

		LLdbCmd.CommandText = "call titrator.sp_get_example_solution_species('" & LLfldName.Value & "');"
		set LLdbSpeciesRS = LLdbCmd.Execute()	
		if( not LLdbSpeciesRS.EOF ) then
			set LLfldSpeciesName = LLdbSpeciesRS.Fields( "species_name" )
			set LLfldSolution = LLdbSpeciesRS.Fields( "solution" )
			set LLfldConcentration = LLdbSpeciesRS.Fields( "concentration" )
		end if

		while( not LLdbSpeciesRS.EOF )
%>
		LibraryExampleList[iIndex].AddSpecies("<% = LLfldSpeciesName.Value %>", "<% = LLfldSolution.Value %>", <% = LLfldConcentration %>);
<%	

			LLdbSpeciesRS.MoveNext
		wend
		LLdbSpeciesRS.Close()
		set LLdbSpeciesRS = nothing	

		LLdbRS.MoveNext
	wend
	LLdbRS.Close()
	set LLdbRS = nothing	
%>
		// End LoadLibrary()
	}
</script>

<%
'************************************************************************************************
	if (not IsNull(LLdbConn) ) then
		if (LLdbConn.State <> adStateClosed) then
			LLdbConn.Close()	
		end if
		set LLdbConn = nothing
	end if
	
	if (not IsNull(LLdbCmd) ) then
		set LLdbCmd = nothing
	end if		

'************************************************************************************************
%>