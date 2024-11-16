# from backend.app.api.routers.dashboard_router import DashboardRouter



# dashboard_router = DashboardRouter()
# studies = dashboard_router.get_studies()
# df = pd.DataFrame(studies)

# dash_app= Dash()


# dash_app.layout = html.Div([
#     html.H4(children='particpants per study'),
#     dcc.Graph(id="graph"),
#     dcc.Checklist(
#         id="checklist",
#         options=["study1","study2", "study3", "study4"],
#         value=["study1","study2"],
#         inline=True
#     )
# ])



# @dash_app.callback(

#     Output("graph","figure"),
#     Input("checklist","value")
# )
# # @todo add charts


# def update_line_chart(study_ids):
#     df_filtered = df[df["study_id"].isin(study_ids)]
#     fig = px.line(df_filtered, x="study_id", y="participant_count", color="study_name")
#     return fig