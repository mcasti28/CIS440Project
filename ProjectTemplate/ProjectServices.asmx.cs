﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using MySql.Data;
using MySql.Data.MySqlClient;
using System.Data;

namespace ProjectTemplate
{     
	[WebService(Namespace = "http://tempuri.org/")]
	[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
	[System.ComponentModel.ToolboxItem(false)]
	[System.Web.Script.Services.ScriptService]

	public class ProjectServices : System.Web.Services.WebService
	{
		////////////////////////////////////////////////////////////////////////
		///replace the values of these variables with your database credentials
		////////////////////////////////////////////////////////////////////////
		private string dbID = "group1";
		private string dbPass = "!!Cis440";
		private string dbName = "group1";
		////////////////////////////////////////////////////////////////////////
		
		////////////////////////////////////////////////////////////////////////
		///call this method anywhere that you need the connection string!
		////////////////////////////////////////////////////////////////////////
		private string getConString() {
			return "SERVER=107.180.1.16; PORT=3306; DATABASE=" + dbName+"; UID=" + dbID + "; PASSWORD=" + dbPass;
		}
		////////////////////////////////////////////////////////////////////////



		/////////////////////////////////////////////////////////////////////////
		//don't forget to include this decoration above each method that you want
		//to be exposed as a web service!
		[WebMethod(EnableSession = true)]
		/////////////////////////////////////////////////////////////////////////
		public string TestConnection()
		{
			try
			{
				string testQuery = "select * from employee";

				////////////////////////////////////////////////////////////////////////
				///here's an example of using the getConString method!
				////////////////////////////////////////////////////////////////////////
				MySqlConnection con = new MySqlConnection(getConString());
				////////////////////////////////////////////////////////////////////////

				MySqlCommand cmd = new MySqlCommand(testQuery, con);
				MySqlDataAdapter adapter = new MySqlDataAdapter(cmd);
				DataTable table = new DataTable();
				adapter.Fill(table);
				return "Success!";
			}
			catch (Exception e)
			{
				return "Something went wrong, please check your credentials and db name and try again.  Error: "+e.Message;
			}
		}

        [WebMethod(EnableSession = true)]
        public bool LogOn(string userName, string pass)
        {
            //we return this flag to tell them if they logged in or not
            bool success = false;

            //our connection string comes from our web.config file like we talked about earlier
            string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["group1"].ConnectionString;
            //here's our query.  A basic select with nothing fancy.  Note the parameters that begin with @
            //NOTICE: we added admin to what we pull, so that we can store it along with the id in the session
            string sqlSelect = "SELECT idEmployee FROM Employee WHERE username=@idValue and password=@passValue";

            //set up our connection object to be ready to use our connection string
            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            //set up our command object to use our connection, and our query
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            //tell our command to replace the @parameters with real values
            //we decode them because they came to us via the web so they were encoded
            //for transmission (funky characters escaped, mostly)
            sqlCommand.Parameters.AddWithValue("@idValue", HttpUtility.UrlDecode(userName));
            sqlCommand.Parameters.AddWithValue("@passValue", HttpUtility.UrlDecode(pass));

            //a data adapter acts like a bridge between our command object and 
            //the data we are trying to get back and put in a table object
            MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
            //here's the table we want to fill with the results from our query
            DataTable sqlDt = new DataTable();
            //here we go filling it!
            sqlDa.Fill(sqlDt);
            //check to see if any rows were returned.  If they were, it means it's 
            //a legit account
            if (sqlDt.Rows.Count > 0)
            {
                //if we found an account, store the id in the session
                //so we can check those values later on other method calls 
                Session["idEmployee"] = sqlDt.Rows[0]["idEmployee"];
                success = true;
            }
            //return the result!
            return success;
        }

        [WebMethod(EnableSession = true)]
        public bool LogOff()
        {
            //if they log off, then we remove the session.  That way, if they access
            //again later they have to log back on in order for their ID to be back
            //in the session!
            Session.Abandon();
            return true;
        }

        [WebMethod(EnableSession = true)]
        public void Shift(int shift, string date)
        {
            if (Session["idEmployee"] != null)
            {
                string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["group1"].ConnectionString;
                //the only thing fancy about this query is SELECT LAST_INSERT_ID() at the end.  All that
                //does is tell mySql server to return the primary key of the last inserted row.
                string sqlSelect = "insert into Availability (shift, date, idEmployee) " +
                    "values(@shiftValue, @dateValue, @idValue); SELECT LAST_INSERT_ID();";

                MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
                MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

                sqlCommand.Parameters.AddWithValue("@shiftValue", shift);
                sqlCommand.Parameters.AddWithValue("@dateValue", HttpUtility.UrlDecode(date));
                sqlCommand.Parameters.AddWithValue("@idValue", Session["idEmployee"]);

                //this time, we're not using a data adapter to fill a data table.  We're just
                //opening the connection, telling our command to "executescalar" which says basically
                //execute the query and just hand me back the number the query returns (the ID, remember?).
                //don't forget to close the connection!
                sqlConnection.Open();
                //we're using a try/catch so that if the query errors out we can handle it gracefully
                //by closing the connection and moving on
                try
                {
                    int accountID = Convert.ToInt32(sqlCommand.ExecuteScalar());
                    //here, you could use this accountID for additional queries regarding
                    //the requested account.  Really this is just an example to show you
                    //a query where you get the primary key of the inserted row back from
                    //the database!
                }
                catch (Exception e)
                {
                }
                sqlConnection.Close();
            }

            
        }
    }
	
}
